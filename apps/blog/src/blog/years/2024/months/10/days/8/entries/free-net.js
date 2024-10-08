import { html } from "htm/preact";
import { Code } from "../../../../../../../components/code.js";
import { BlogLink } from "../../../../../../../components/blog-link.js";

const title = "The Free Net";

const slug = "free-net";

const hour = 8;

const minute = 11;

const links = {
  uDistributionRadiant: "https://www.reddit.com/user/Distribution-Radiant/",
  redditComment:
    "https://www.reddit.com/r/vintagecomputing/comments/159swu2/comment/jtig8le/",
};

const body = () => html`
  <p>
    And now, in a possibly vain attempt at keeping this history from dying of
    link rot, I present the full Reddit post from
    <${BlogLink} href=${links.uDistributionRadiant}>u/Distribution Radiant</${BlogLink}>.
  </p>

  <hr />

  <p>
    Rio Grande FreeNet, run by Don Furth from El Paso Community College. One of
    the first, if not the first, in Texas. Still remember my login, even though
    it's been gone for over 20 years at this point. Searching google for it
    still turns up a couple of BBS lists I wrote for my area..
  </p>

  <p>
    Don passed about 20 years ago (and RGFN shut down quite a bit before then),
    but I had the opportunity to help him find dead modems a few times, and just
    kinda geek out in the data center at EPCC. He had a wall of something like
    50 or 60 USR Sportsters connected to some kind of UNIX box (I was 16 or so
    at the time, and only knew PCs at that point, but I want to say it was
    something from Sun), and every time a solid thunderstorm rolled through, a
    few modems would get zapped. They'd still accept commands, most would still
    pick up the line, but that was all they could do after a nearby lightning
    strike. Made it frustrating when trying to call in and couldn't get a
    working modem (since the PBX wouldn't roll over to the next line unless you
    happened to call when someone was trying to connect to one of the dead
    modems).
  </p>

  <p>
    Still have a shirt he gave me sometime in the 90s. The shirt:
    https://i.imgur.com/3v9cNLG.png (can't wear it anymore since I've put on
    about 100 pounds in the 30 years since I got it, but I'll keep that shirt
    forever).
  </p>

  <p>
    I lost a Sportster the same way too - lightning struck near my house. It
    would detect ringing, it would try to pick up the line (you'd hear the relay
    click too), it made noises from the speaker, but it was just silence on the
    other end. It wouldn't detect a dialtone when trying to dial out. Took out
    the serial card too. US Robotics actually replaced the modem under warranty.
  </p>

  <p>
    Article from Texas Monthly about online services in Texas, and specifically
    mentioning RGFN as "the grandaddy":
    https://www.texasmonthly.com/being-texan/gone-to-cybertexas/
  </p>

  <p>
    I also ran my own dialup BBS from 1992-1997 in El Paso, then from 97-98
    after moving to Dallas (mine never caught on in Dallas, but I had one of the
    busiest free ones in El Paso, averaging ~100-120 calls a day across 3
    lines). The above linked article mentions my current home (Austin) had over
    400 at one time, which blows me away - El Paso was only slightly smaller,
    but I think at our peak we had maybe 75-100? I used to maintain a BBS list
    that was published in the El Paso Times once a week (took over after someone
    else stopped doing it), and by that point I think we were down to 30 or 40.
  </p>

  <p>
    Wish I could remember all the echonet networks I carried on my BBS - I was
    either a state or regional hub for several. I know I had FidoNet, TNGNet,
    StormNet, NirvanaNet (RIP TOTSE), and some others, but it's been so long
    that I just don't remember anymore. NirvanaNet made up the bulk of my
    echonet traffic IIRC (really, most traffic to my BBS in general - it was
    mainly a game and message system, no warez, no porn, also "freedom of speech
    as long as it's not hate speech", "use a real sounding name if you're going
    to post on Fidonet", etc), and I think I was either the only BBS in my area
    carrying it, or one of two. I was a regional hub for it, and my region was
    made up of two time zones (El Paso is the only major city in TX in mountain
    time), so "zone mail hour" for me was more like 2-3 hours - but only
    happened on one line (the one with the 33.6k modem - the other two were only
    14.4k). I did log caller ID though, and blocked calls with blocked caller
    ID, so if someone tried to get around a hate speech ban, they'd need a new
    phone #.
  </p>

  <p>/ramble</p>
`;

/** @type {import("../../../../../../../blog.js").BlogEntry} */
export const freeNet = {
  body,
  hour,
  minute,
  slug,
  title,
};
