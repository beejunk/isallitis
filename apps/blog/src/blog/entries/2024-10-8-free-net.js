import { html } from "htm/preact";
import { BlogLink } from "../components/blog-link.js";

export const title = "The Free Net";

export const slug = "free-net";

export const hour = 8;

export const minute = 11;

export const links = [
  {
    title: "Fight For Our Web",
    url: "https://www.citationneeded.news/fighting-for-our-web/",
  },
  {
    title: "WebCrawler on Wikipedia",
    url: "https://en.wikipedia.org/wiki/WebCrawler",
  },
  {
    title: "Free-Net on Wikipedia",
    url: "https://en.wikipedia.org/wiki/Free-net",
  },
  {
    title: "Reddit comment about the Rio Grande Free Net",
    url: "https://www.reddit.com/r/vintagecomputing/comments/159swu2/comment/jtig8le/",
  },
  {
    title: "Reddit user Distribution-Radiant",
    url: "https://www.reddit.com/user/Distribution-Radiant/",
  },
];

export const body = () => html`
  <p>
    Molly White recently gave <${BlogLink} href=${links[0].url}>a talk
    called "Fighting For Our Web"</${BlogLink}>. It's inspiring stuff all around,
    but this question stood out:
  </p>
  
  <blockquote>
    <p>Do you remember the first time you felt like the web was magic?</p>
  </blockquote>
  
  <p>
    While I did have a friend whose family were early adopters and
    would connect to things like bulletin board systems, the first time I really
    got to use the web - browser and all - was when I was in middle school. A
    group of us bussed over to the public computer lab at the University of
    Texas at El Paso, where you could sign up for time to use the Internet. I
    loaded up <${BlogLink} href=${links[1].url}>WebCrawler</${BlogLink}> (which
    was the fashion at the time), and was hit with that magical feeling
    when I realized that I could look up any guitar tab I wanted. For free. No
    strings attached (well, with the exception that the tab was probably wildly
    inaccurate).
  </p>
  
  <p>
    A year or so after these trips to UTEP, my grandparents gifted us a computer.
    It ran Windows 3.11, although Windows 95 had just come out and was included
    as an upgrade. As part of the gift we also got copies of WarCraft II
    and Myst. I actually still use the power supply that came with that computer;
    many of the bulbs in the switches still work!
  </p>
  
  <p>
    But that's not the important part. The important part is that the computer
    had a modem. And I was able to use this modem to connect to the Internet.
    For free. No strings attached.
  </p>
  
  <p>
    Okay, well, some strings were attached. The "for free" part was because there was a
    <${BlogLink} href=${links[2].url}>free-net</${BlogLink}> called the Rio Grande Free Net that was
    run nearby at El Paso Community College by someone named Don Furth. And while
    you could connect to it for free, it all ran in a terminal and so wasn't
    exactly exciting to look at.
  </p>
 
  <p>
    But it was exciting to use.
  </p>
  
  <p>
    Oh, and did I mention it was free? This was extremely important for a few reasons.
    First, my family and I were poor. Second, the Rio Grand Free Net (and the concept
    of free-nets in general) exposed me to the idea that there were people out there
    who not only built the Internet for everyone to use, but who were dedicated to
    making the Internet available to anyone, just because they thought that was
    a right and good thing to do.
  </p>
  
  <p>
    I eventually did figure out a way to get the free-net hooked up to NetScape.
    Which taught me another valuable lesson: if you were obsessive and dedicated
    enough and willing to put up with a lot of hassle, then you could eventually
    get computers to do mostly anything you'd like them to do.
  </p>
  
  <p>
    This sense that the Internet was for everyone and that computers were for
    everyone - it was a nice feeling. It was different. It wasn't the type of thing
    I ran into a lot. It wasn't something that you had to walk into a store and
    look at longingly while someone behind a counter squinted at you; maybe take
    for a test run, but never really get to use.
  </p>
  
  <p>
    That's what the Internet meant to me.
  </p>
  
  <h2>Addendum</h2>
  
  <p>
    The info I posted above about the Rio Grande Free Net was
    found in <${BlogLink} href=${links[3].url}>a Reddit comment</${BlogLink}>,
    which in this case is the likeliest place to find such a thing. In an odd twist 
    of fate, the modem that came with our computer got zapped by a storm one day and
    had to be replaced. I wonder if it was one of the storms described in the
    comment.
  </p>
  
  <p>
    Anyway, in a possibly vain attempt at keeping this history from dying of link rot,
    here is the full Reddit post from user
    <${BlogLink} href=${links[4].url}>Distribution-Radiant</${BlogLink}>.
    It's a nice post that's worth preserving.
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
