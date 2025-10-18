import { signal, effect } from "@preact/signals-core";

const SW_PATH = "/sw.js";

// -------------------------------------------------------------------------- //
// States
// -------------------------------------------------------------------------- //

/**
 * Waiting for confirmation that the environment supports service workers.
 * @type {"WAITING_FOR_SUPPORT_CHECK"}
 */
const WAITING_FOR_SUPPORT_CHECK = "WAITING_FOR_SUPPORT_CHECK";

/**
 * Waiting for the service worker registration to complete.
 * @type {"WAITING_FOR_REGISTRATION"}
 */
const WAITING_FOR_REGISTRATION = "WAITING_FOR_REGISTRATION";

/**
 * Registration completed successfully. This does not mean that there is an active
 * service worker, it only means registration succeeded. The service worker could
 * still be installing are waiting.
 *
 * Final state.
 *
 * @type {"REGISTRATION_SUCCESS"}
 **/
const REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";

/**
 * There was an error while registering the service worker.
 *
 * Final state.
 *
 * @type {"REGISTRATION_ERROR"}
 */
const REGISTRATION_ERROR = "REGISTRATION_ERROR";

// -------------------------------------------------------------------------- //
// Events
// -------------------------------------------------------------------------- //

/** @type {"SUPPORT_CHECK_SUCCEEDED"} */
const SUPPORT_CHECK_SUCCEEDED = "SUPPORT_CHECK_SUCCEEDED";

/** @type {"SUPPORT_CHECK_FAILED"} */
const SUPPORT_CHECK_FAILED = "SUPPORT_CHECK_FAILED";

/** @type {"REGISTRATION_SUCCEEDED"} */
const REGISTRATION_SUCCEEDED = "REGISTRATION_SUCCEEDED";

/** @type {"REGISTRATION_FAILED"} */
const REGISTRATION_FAILED = "REGISTRATION_FAILED";

// -------------------------------------------------------------------------- //
// Types
// -------------------------------------------------------------------------- //

/**
 * @typedef {(
 *   | typeof WAITING_FOR_SUPPORT_CHECK
 *   | typeof WAITING_FOR_REGISTRATION
 *   | typeof REGISTRATION_SUCCESS
 *   | typeof REGISTRATION_ERROR
 * )} RegistrationState
 */

/**
 * @typedef {(
 *   | typeof REGISTRATION_SUCCEEDED
 *   | typeof REGISTRATION_FAILED
 *   | typeof SUPPORT_CHECK_SUCCEEDED
 *   | typeof SUPPORT_CHECK_FAILED
 * )} RegistrationEvent
 */

/**
 * @typedef {Object} RegistrationStateDefinition
 * @prop {Partial<Record<RegistrationEvent, RegistrationState>>} [on]
 * @prop {boolean} [final]
 */

/**
 * @typedef {Record<RegistrationState, RegistrationStateDefinition>} RegistrationMachineDefinition
 */

/**
 * @typedef {Object} RegistrationMachine
 * @prop {(event: RegistrationEvent) => void} send
 * @prop {() => RegistrationState} getState
 * @prop {() => boolean} done
 */

/**
 * @typedef {import("@preact/signals-core").Signal<RegistrationState>} RegistrationStateSignal
 */

/**
 * @type {RegistrationMachineDefinition}
 */
const REGISTRATION_MACHINE_DEFINITION = {
  [WAITING_FOR_SUPPORT_CHECK]: {
    on: {
      [SUPPORT_CHECK_SUCCEEDED]: WAITING_FOR_REGISTRATION,
      [SUPPORT_CHECK_FAILED]: REGISTRATION_ERROR,
    },
  },

  [WAITING_FOR_REGISTRATION]: {
    on: {
      [REGISTRATION_SUCCEEDED]: REGISTRATION_SUCCESS,
      [REGISTRATION_FAILED]: REGISTRATION_ERROR,
    },
  },

  [REGISTRATION_ERROR]: {
    final: true,
  },

  [REGISTRATION_SUCCESS]: {
    final: true,
  },
};

/**
 * @param {RegistrationMachine} registrationMachine
 * @returns {Partial<Record<RegistrationState, () => void>>}
 */
function createRegistrationActions({ send }) {
  return {
    async [WAITING_FOR_SUPPORT_CHECK]() {
      if (!navigator.serviceWorker) {
        send(SUPPORT_CHECK_FAILED);
      } else {
        send(SUPPORT_CHECK_SUCCEEDED);
      }
    },

    async [WAITING_FOR_REGISTRATION]() {
      try {
        await navigator.serviceWorker.register(SW_PATH);
        send(REGISTRATION_SUCCEEDED);
      } catch (err) {
        console.error(`${err}`);
        send(REGISTRATION_FAILED);
      }
    },
  };
}

/**
 * @param {RegistrationStateSignal} registrationState
 * @returns {RegistrationMachine}
 */
function createRegistrationMachine(registrationState) {
  return {
    done() {
      const currentStateNode =
        REGISTRATION_MACHINE_DEFINITION[registrationState.value];
      return currentStateNode.final ?? false;
    },

    getState() {
      return registrationState.value;
    },

    /**
     * @param {RegistrationEvent} event
     */
    send(event) {
      const currentState = registrationState.value;
      const nextState =
        REGISTRATION_MACHINE_DEFINITION[currentState]?.on?.[event];

      if (nextState) {
        registrationState.value = nextState;
      }
    },
  };
}

/**
 * @returns {Promise<RegistrationState>}
 */
export async function register() {
  /** @type {RegistrationStateSignal} */
  const registrationState = signal(WAITING_FOR_SUPPORT_CHECK);
  const registrationMachine = createRegistrationMachine(registrationState);
  const registrationActions = createRegistrationActions(registrationMachine);

  return new Promise((resolve) => {
    effect(() => {
      const currentState = registrationMachine.getState();

      if (registrationMachine.done()) {
        resolve(currentState);
      } else {
        registrationActions[currentState]?.();
      }
    });
  });
}
