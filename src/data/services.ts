/**
 * Every service page on the site is generated from this array. Adding an entry
 * creates the page, the nav link, the sitemap entry, the schema, and the
 * internal links from the city pages -- no other file needs to change.
 */

export type ServiceFaq = { question: string; answer: string }

/**
 * A real photo for a service page. Drop the file in /public/images/ and set
 * `src` to its path WITHOUT the "/public" prefix -- public/ is the web root,
 * so public/images/x.jpg is served at /images/x.jpg.
 *
 * `width` and `height` must be the file's real pixel dimensions. They reserve
 * the right box before the image loads, which is what keeps layout shift at
 * zero. Right-click the file > Properties > Details to read them off.
 */
export type ServiceImage = {
  src: string
  width: number
  height: number
  /** Describe what is actually in the photo. Falls back to a generic label. */
  alt?: string
}

export type Service = {
  slug: string
  /** Full name. Used in <h1> and schema. */
  name: string
  /** Short name for nav, cards and breadcrumbs. */
  shortName: string
  /** `primary` services get top-level nav placement and homepage cards. */
  tier: 'primary' | 'secondary'
  /** One line, ~90 chars. Used on cards and in the services index. */
  summary: string
  metaTitle: string
  metaDescription: string
  /** Opening copy on the service page. Each string is a paragraph. */
  intro: string[]
  /** "What's included" / scope bullets. */
  includes: string[]
  /** Symptom-led list -- this is the section that ranks for problem searches. */
  signsHeading: string
  signs: string[]
  /** How the job actually runs, start to finish. */
  process: { title: string; detail: string }[]
  faqs: ServiceFaq[]
  /**
   * Optional real photos. Leave either one out and that slot keeps rendering
   * the dimensioned placeholder, so you can swap them in one at a time.
   * heroImage sits beside the <h1>; bodyImage sits above the FAQs.
   */
  heroImage?: ServiceImage
  bodyImage?: ServiceImage
  /** Slugs of services to cross-link at the bottom of the page. */
  related: string[]
  /** Simple line-art key used by the ServiceIcon component. */
  icon: 'wrench' | 'door' | 'opener' | 'spring' | 'new-door' | 'wood' | 'haul' | 'carport'
}

export const services: Service[] = [
  {
    slug: 'garage-door-repair',
    name: 'Garage Door Repair',
    shortName: 'Repair',
    tier: 'primary',
    icon: 'wrench',
    summary: 'Door off track, won’t close, loud grinding, broken cable — most repairs done in one visit.',
    metaTitle: 'Garage Door Repair | Gainesville & North Georgia',
    metaDescription:
      'Garage door repair across North Georgia. Broken springs, off-track doors, cables, rollers and openers. Family run since 1984. Call (770) 554-9990.',
    intro: [
      'A garage door is the heaviest moving thing in most houses, and when it quits it usually quits at the worst possible time — on the way to work, or with the car shut inside. We repair every part of the system: springs, cables, rollers, hinges, tracks, brackets, weather seal, and the opener itself.',
      'We have been doing this in Hall County and the surrounding counties since 1984. That means we have seen your door before. Most of what we run into is a wear item that can be replaced in a single visit, and we carry the common parts on the truck so you are not waiting a week on a spring.',
      'If a repair does not make sense — the door is rusted through, the sections are cracked at the hinges, the panels have not been made in fifteen years — we will tell you that instead of selling you a repair that buys you two months.',
    ],
    includes: [
      'Torsion and extension spring replacement',
      'Lift cable replacement and re-spooling',
      'Roller, hinge and bearing replacement',
      'Track straightening, realignment and re-anchoring',
      'Off-track and derailed door recovery',
      'Section and panel replacement where parts are still available',
      'Bottom weather seal and side/top stop molding',
      'Opener repair: gears, belts, chains, logic boards, safety sensors',
      'Full system safety inspection and balance adjustment',
    ],
    signsHeading: 'Signs your door needs a repair',
    signs: [
      'The door will not open, or opens a few inches and stops',
      'You hear a loud bang from the garage and now nothing works',
      'There is a visible gap in the spring above the door',
      'The door is crooked in the opening or hanging off one side',
      'It jerks, shudders or grinds on the way up',
      'The door reverses right after it touches the floor',
      'A cable is loose, frayed or off the drum',
      'The door is far too heavy to lift by hand with the opener disconnected',
    ],
    process: [
      {
        title: 'Tell us what it is doing',
        detail:
          'Call and describe the symptom. Noise, position, whether it moves at all. Nine times out of ten we can narrow it down over the phone and bring the right parts.',
      },
      {
        title: 'On-site diagnosis',
        detail:
          'We test the door under power and by hand, check the spring balance, and inspect the cables, drums, rollers and track. You get told what failed and why.',
      },
      {
        title: 'Price before work starts',
        detail:
          'You hear the number and approve it before a wrench comes out. If there is a cheaper option that will hold, we will say so.',
      },
      {
        title: 'Repair and re-balance',
        detail:
          'Parts get replaced, the spring is tensioned to the actual door weight, and the opener force and travel limits are reset so the new setup does not chew itself up.',
      },
      {
        title: 'Test and walk through',
        detail:
          'We cycle the door, test the safety reverse and the photo eyes, and show you what to keep an eye on.',
      },
    ],
    faqs: [
      {
        question: 'How fast can you get here?',
        answer:
          'Call us and we will give you a real answer for that day. Gainesville, Oakwood and Flowery Branch are our home turf and are usually the quickest. We are a small crew, so we would rather tell you "tomorrow morning" than promise an hour we cannot hit.',
      },
      {
        question: 'Can I use the door until you get here?',
        answer:
          'If a spring or cable is broken, no. Leave it down and do not run the opener — the opener is not built to lift the door on its own and you can bend the top section or pull the whole door off the track. If the car is trapped inside, tell us on the phone.',
      },
      {
        question: 'Is it worth repairing an old door?',
        answer:
          'Often, yes. Hardware is a wear item and a good steel door can run thirty years. What kills a door is rust at the bottom section, cracked panels around the hinges, or a discontinued section that cannot be matched. We will look at it and tell you which side of that line you are on.',
      },
      {
        question: 'Do you work on doors you did not install?',
        answer:
          'Yes. We service every common brand and most of the older ones. If you have a builder-grade door from a subdivision build, we have almost certainly worked on that model.',
      },
    ],
    heroImage: {
      src: '/images/repair-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Kauffman technician drilling into the track bracket on a white sectional garage door from inside the garage',
    },
    bodyImage: {
      src: '/images/repair-page.png',
      width: 1670,
      height: 942,
      alt: 'Before and after: a dented, weathered white garage door with a damaged bottom section, replaced with a clean white panelled door with matching window inserts',
    },
    related: ['garage-door-spring-replacement', 'garage-door-openers', 'new-garage-doors'],
  },

  {
    slug: 'garage-door-installation',
    name: 'Garage Door Installation',
    shortName: 'Installation',
    tier: 'primary',
    icon: 'door',
    summary: 'New door measured, ordered and installed right — square, balanced and sealed to the opening.',
    metaTitle: 'Garage Door Installation | Gainesville & North GA',
    metaDescription:
      'Garage door installation in Gainesville, Flowery Branch, Cumming and Buford. Correct measurement and properly sized springs. Call (770) 554-9990.',
    intro: [
      'Installation is where a garage door is won or lost. A good door hung wrong will bind, wear out its rollers, and burn up an opener. A correctly installed door is quiet, balanced, and stays that way for decades.',
      'We measure the rough opening, headroom, backroom and sideroom before anything is ordered, so the track and spring package actually fit your garage. Then we set the door square to the opening, size the springs to the finished weight of the door, and seal the perimeter.',
      'We install for homeowners, builders and property managers throughout Hall, Forsyth, Jackson, Gwinnett, Dawson and White counties.',
    ],
    includes: [
      'On-site measurement of opening, headroom, backroom and sideroom',
      'Help choosing insulation level, panel style, glass and hardware',
      'Removal and disposal of the old door and track',
      'New track, rollers, hinges, brackets and struts',
      'Spring package sized to the actual finished door weight',
      'Perimeter weather seal and bottom astragal',
      'Opener reconnection, or new opener installation',
      'Travel limit, force and safety-reverse setup',
      'Cleanup and haul away',
    ],
    signsHeading: 'When installation is the right call',
    signs: [
      'The bottom section is rusted or rotted through',
      'Panels are cracked or torn at the hinge lines',
      'Replacement sections for your door are discontinued',
      'The door has been hit by a vehicle',
      'You are heating or cooling the garage and the door has no insulation',
      'You are converting a carport or finishing a new build',
      'The door is a single-pane, uninsulated original from the 70s or 80s',
    ],
    process: [
      {
        title: 'Measure and quote',
        detail:
          'We come out, measure the opening and the clearances, look at how the garage is framed, and give you a written price on the door and the labor.',
      },
      {
        title: 'Pick the door',
        detail:
          'Steel, wood, insulated or not, windows or solid, hardware style. We will tell you honestly where the extra money is worth it and where it is not.',
      },
      {
        title: 'Order and schedule',
        detail:
          'The door is ordered to your opening. We call you with an install date as soon as it lands.',
      },
      {
        title: 'Old door out',
        detail:
          'The existing door, track and hardware come out and go on our truck. Springs are released safely, not cut.',
      },
      {
        title: 'New door in',
        detail:
          'Sections stacked and levelled, track plumbed to the opening, struts and hardware set, springs wound to the finished weight.',
      },
      {
        title: 'Seal, tune, test',
        detail:
          'Weather seal on all four sides, opener limits and force reset, safety reverse verified, then we run it with you.',
      },
    ],
    faqs: [
      {
        question: 'How long does an installation take?',
        answer:
          'A standard single or double door swap is typically a half day. Anything involving new framing, a carport conversion, or two doors will run longer. We will tell you the realistic window when we quote it.',
      },
      {
        question: 'Do I need a new opener with a new door?',
        answer:
          'Not automatically. If your opener is under about ten years old, has working photo eyes and the new door is a similar weight, we will reuse it. If you are going from a light uninsulated door to a heavy insulated one, or the opener is a chain-drive from the 90s, replacing it at the same time saves a second trip.',
      },
      {
        question: 'Is an insulated door worth it in Georgia?',
        answer:
          'If the garage is attached, has a room above it, or you use it as a shop, yes — a North Georgia garage gets brutal in July. If it is a detached, unconditioned storage garage, an insulated door mostly just buys you a quieter, more rigid door. That is a real benefit, but it is a different reason.',
      },
      {
        question: 'Can you match the door to my house?',
        answer:
          'Yes. Panel style, color, window layout and hardware are all choices. Bring us a photo of the house and we will narrow it down fast.',
      },
    ],
    heroImage: {
      src: '/images/install-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Kauffman installer fastening the vertical track to the jamb of a new white garage door on a stone-front home',
    },
    bodyImage: {
      src: '/images/install-body.png',
      width: 1670,
      height: 941,
      alt: 'Before and after: a rust-stained beige double garage door replaced with a black long-panel door with a row of windows, on a brick and tan-siding home',
    },
    related: ['new-garage-doors', 'custom-wooden-garage-doors', 'garage-door-removal-and-haul-away'],
  },

  {
    slug: 'garage-door-openers',
    name: 'Garage Door Openers',
    shortName: 'Openers',
    tier: 'primary',
    icon: 'opener',
    summary: 'Opener repair and new installs — belt, chain and wall-mount units, keypads, remotes and sensors.',
    metaTitle: 'Garage Door Opener Repair & Installation | North GA',
    metaDescription:
      'Garage door opener repair and installation in North Georgia. Belt, chain and wall-mount units, sensors, remotes and keypads. Call (770) 554-9990.',
    intro: [
      'An opener is the part people notice most, because it is the part that talks back. It beeps, it flashes, it refuses to close, it wakes up the bedroom above the garage. We repair openers and install new ones.',
      'A lot of "opener problems" are not the opener. A door that is out of balance makes the opener work far harder than it was designed to, and the opener is just the thing that finally gave up. We check the door first, because replacing an opener on an unbalanced door will get you a second dead opener.',
      'When you do need a new one, we will point you at the drive type that fits the garage — belt drive if there is living space above, chain if it is a detached shop and you would rather spend the money elsewhere, wall-mount if headroom is tight or you want the ceiling clear.',
    ],
    includes: [
      'Opener diagnosis and repair',
      'Gear and sprocket kits, belts, chains, trolleys and rail repair',
      'Logic board and capacitor replacement',
      'Photo-eye safety sensor alignment and replacement',
      'Travel limit and force adjustment',
      'New belt drive, chain drive and wall-mount opener installation',
      'Remote, keypad and wall-console programming',
      'Wi-Fi and smartphone-controlled opener setup',
      'Battery backup units where required',
    ],
    signsHeading: 'Common opener symptoms',
    signs: [
      'The opener runs but the door does not move',
      'The door goes down and immediately comes back up',
      'The lights on the sensors are off, flickering, or one is red',
      'Grinding or a whirring noise with no motion — usually a stripped gear',
      'The remote works up close but not from the driveway',
      'The opener hums and trips the breaker',
      'The door stops partway and reverses',
      'You want to stop using a 25-year-old opener with no rolling code',
    ],
    process: [
      {
        title: 'Check the door, not just the motor',
        detail:
          'We disconnect the opener and lift the door by hand. If it is heavy or does not stay put at waist height, the springs are the real problem and we fix that first.',
      },
      {
        title: 'Diagnose the unit',
        detail:
          'Sensors, wiring, logic board, capacitor, gear set. Older units often come down to one twelve-dollar part.',
      },
      {
        title: 'Repair or replace, your call',
        detail:
          'We give you both numbers. On a unit past roughly fifteen years with a dead board, replacement is usually the better spend, and we will say so.',
      },
      {
        title: 'Install and program',
        detail:
          'New unit mounted and braced, rail set, sensors installed at the correct height, limits and force dialed in.',
      },
      {
        title: 'Set up your remotes',
        detail:
          'Remotes, keypad, wall console, car buttons and the phone app if the unit has one. We do not leave until they all work.',
      },
    ],
    faqs: [
      {
        question: 'My door closes halfway then goes back up. Is the opener bad?',
        answer:
          'Usually not. That is the safety system doing its job — most often a misaligned or dirty photo eye, or the down force set too low for a door that has gotten stiff. Both are quick fixes. If the door is also heavy by hand, the springs are the underlying cause.',
      },
      {
        question: 'Belt drive or chain drive?',
        answer:
          'Belt drive if there is a bedroom or office over the garage, or the garage is attached to a quiet part of the house — it is noticeably quieter. Chain drive is fine for a detached garage or shop and costs less. Wall-mount is the answer when you have low headroom, want storage overhead, or want the quietest option available.',
      },
      {
        question: 'Can you program my car to the opener?',
        answer:
          'Yes, on most vehicles with a built-in HomeLink-style system. Bring the car in the garage when we are there and we will pair it before we leave.',
      },
      {
        question: 'Do new openers need battery backup?',
        answer:
          'Georgia does not currently require it the way California does, but if your garage is the main way into the house it is worth having. Storm season here takes the power out, and a manual release in the dark with a car in the way is a bad time.',
      },
    ],
    heroImage: {
      src: '/images/opener-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Hand pressing a garage door opener remote with a residential garage blurred in the background'
    },
    bodyImage: {
      src: '/images/opener-body.png',
      width: 1670,
      height: 942,
      alt: 'Ceiling-mounted garage door opener with its light on inside a residential garage.'
    },
    related: ['garage-door-repair', 'garage-door-spring-replacement', 'garage-door-installation'],
  },

  {
    slug: 'garage-door-spring-replacement',
    name: 'Garage Door Spring Replacement',
    shortName: 'Spring Replacement',
    tier: 'secondary',
    icon: 'spring',
    summary: 'Broken spring? Do not run the opener. Torsion and extension springs replaced and balanced.',
    metaTitle: 'Garage Door Spring Replacement | North Georgia',
    metaDescription:
      'Broken garage door spring replacement in North Georgia. Torsion and extension springs sized to your door, not guessed. Call (770) 554-9990.',
    intro: [
      'The springs do essentially all of the lifting. The opener only guides a door that the springs have already made nearly weightless. When a spring breaks, the door becomes a 150 to 400 pound slab with nothing holding it up.',
      'If you heard a bang like a gunshot from the garage, that was almost certainly a torsion spring. Leave the door down, do not run the opener, and call us.',
      'We replace torsion and extension springs, size them to your door rather than to whatever was on there before, and re-balance the whole system afterward.',
    ],
    includes: [
      'Torsion spring replacement, single and dual spring systems',
      'Extension spring replacement with safety cables',
      'Correct wire size, inside diameter and length sizing for your door weight',
      'Center bearing, end bearing plate and shaft inspection',
      'Cable and drum inspection — cables usually wear alongside springs',
      'Door balance test and adjustment',
      'Opener force and limit reset after the new springs are in',
    ],
    signsHeading: 'How to tell a spring has failed',
    signs: [
      'A loud bang from the garage, then the door will not open',
      'A visible two-inch gap in the coiled spring above the door',
      'The opener strains, hums, or lifts the door a few inches and stops',
      'The door is extremely heavy to lift by hand',
      'The door slams down instead of settling',
      'The door will not stay open — it drifts back down',
      'One side of the door lifts before the other',
    ],
    process: [
      {
        title: 'Secure the door',
        detail:
          'The door is clamped and the opener disconnected before anything is touched. A door with a broken spring is a falling hazard, not a repair yet.',
      },
      {
        title: 'Weigh and size',
        detail:
          'We size the replacement to the actual door — wire gauge, inside diameter, length and wind direction. Builder-grade doors are frequently under-sprung from day one, and that is why the spring lasted eight years instead of fifteen.',
      },
      {
        title: 'Replace in pairs',
        detail:
          'On a two-spring door we replace both. They have the same cycle count, so the second one is not far behind, and a mismatched pair pulls the door crooked.',
      },
      {
        title: 'Check the cables and bearings',
        detail:
          'A snapped spring usually takes the cables and center bearing with it over time. We inspect them while we are in there rather than coming back in a month.',
      },
      {
        title: 'Wind, balance, test',
        detail:
          'Springs wound to spec, door balance checked by hand at three heights, opener limits and force reset, safety reverse verified.',
      },
    ],
    faqs: [
      {
        question: 'Can I replace a garage door spring myself?',
        answer:
          'We would strongly advise against it. A torsion spring holds several hundred pounds of stored energy and it releases through the winding bars. This is the repair that sends people to the emergency room. It is also a job where the wrong spring size quietly destroys your opener over the following year.',
      },
      {
        question: 'Should I replace both springs if only one broke?',
        answer:
          'Yes, on a two-spring door. They were installed the same day and have the same cycle count — the second is typically within months of the first. Replacing one means paying for a second service call soon, and an unmatched pair pulls the door out of level in the meantime.',
      },
      {
        question: 'How long should springs last?',
        answer:
          'Springs are rated in cycles, not years. A standard spring is around 10,000 cycles. A family opening the door four times a day uses about 1,500 cycles a year, so roughly seven years. High-cycle springs run two to three times that and are worth asking about if the garage is your main entrance.',
      },
      {
        question: 'Why did my spring break in the winter?',
        answer:
          'Cold makes steel less forgiving, so a spring already near the end of its cycle life tends to let go on the first properly cold morning. The cold did not cause it — it just picked the day.',
      },
    ],
    heroImage: {
      src: '/images/spring-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Garage door technician replacing a torsion spring inside a residential garage.'
    },
    bodyImage: {
      src: '/images/spring-body.png',
      width: 1670,
      height: 941,
      alt: 'Before-and-after comparison of a broken garage door torsion spring replaced with a new spring.'
    },
    related: ['garage-door-repair', 'garage-door-openers', 'new-garage-doors'],
  },

  {
    slug: 'new-garage-doors',
    name: 'New Garage Doors',
    shortName: 'New Doors',
    tier: 'secondary',
    icon: 'new-door',
    summary: 'Steel, insulated and carriage-house doors — measured to your opening, not to a catalog.',
    metaTitle: 'New Garage Doors | Gainesville & North Georgia',
    metaDescription:
      'New garage doors for North Georgia homes. Insulated steel, carriage house and custom styles, measured and installed by a family shop. (770) 554-9990.',
    intro: [
      'A garage door is usually the largest single thing on the front of a house, so it does more for curb appeal than almost any other replacement you can make. It is also the one people put off the longest.',
      'We sell and install steel, insulated steel, and carriage-house style doors, along with custom wood if that is the direction you want to go. We are not a call center reading from a price sheet — we come look at the house and the opening.',
      'What we will not do is talk you into the top of the line when the mid-grade door is the right door for your garage. Tell us what the garage is used for and what you want it to look like, and we will narrow it to two or three real options.',
    ],
    includes: [
      'In-person measurement and style consultation',
      'Non-insulated, single-layer steel doors',
      'Insulated steel doors, two-layer and three-layer construction',
      'Carriage-house and raised-panel styles',
      'Window sections, decorative hardware and color matching',
      'Custom sizes for non-standard openings',
      'Full removal and haul away of the old door',
      'New track, hardware and correctly sized springs',
      'Opener reconnection or replacement',
    ],
    signsHeading: 'Reasons people replace a door',
    signs: [
      'The old door is rusted, rotted, or damaged past repair',
      'Selling the house and want the front to show well',
      'The garage is becoming a shop, gym or conditioned space',
      'The current door is too loud for the bedroom above it',
      'Parts for the existing door are no longer made',
      'A vehicle backed into it',
      'The door is original to a house built in the 70s, 80s or 90s',
    ],
    process: [
      {
        title: 'Look at the house',
        detail:
          'We measure the opening and the clearances and take in the style of the house so the door does not fight the architecture.',
      },
      {
        title: 'Narrow the options',
        detail:
          'Insulation level, panel style, windows, color, hardware. Three real choices beats a forty-page catalog.',
      },
      {
        title: 'Written price',
        detail:
          'Door, hardware, springs, labor, haul away — one number, no line items that appear on install day.',
      },
      {
        title: 'Order and install',
        detail:
          'Door built to your opening, old door removed, new one hung square, sprung to weight, sealed and tuned.',
      },
    ],
    faqs: [
      {
        question: 'What does a new garage door cost?',
        answer:
          'It depends on size, insulation, style and whether the opening needs any work — a basic single-car steel door and a custom insulated double with windows are a long way apart. We measure and give you a written price before anything is ordered. Call us and we can give you a ballpark over the phone once we know the size.',
      },
      {
        question: 'How long until my door arrives?',
        answer:
          'Standard sizes and colors are typically the quickest. Custom sizes, unusual colors and wood take longer. We will give you the current lead time when we quote, and we call you when it lands rather than making you chase us.',
      },
      {
        question: 'What R-value should I look for?',
        answer:
          'For a detached storage garage, insulation is mostly about rigidity and noise. For an attached garage, a room above the garage, or a shop you actually work in, step up to a two- or three-layer door — in a North Georgia summer you will feel the difference. We will tell you which category you are in.',
      },
      {
        question: 'Do you do doors for new construction?',
        answer:
          'Yes. We work with homeowners, builders and remodelers throughout Hall, Forsyth, Jackson, Gwinnett, Dawson and White counties.',
      },
    ],
    heroImage: {
      src: '/images/door-hero.png',
      width: 1422,
      height: 1106,
      alt: 'New dark wood carriage-style garage door with decorative hardware and upper windows on a stone-front home.'
    },
    bodyImage: {
      src: '/images/door-body.png',
      width: 1670,
      height: 941,
      alt: 'Premium black insulated steel garage door with modern horizontal panels and upper windows on a stone-front home.'
    },
    related: ['garage-door-installation', 'custom-wooden-garage-doors', 'garage-door-removal-and-haul-away'
    ],
  },

  {
    slug: 'custom-wooden-garage-doors',
    name: 'Custom Wooden Garage Doors',
    shortName: 'Custom Wood Doors',
    tier: 'secondary',
    icon: 'wood',
    summary: 'Real wood carriage and custom doors built to your opening — for when a stamped steel door will not do.',
    metaTitle: 'Custom Wood Garage Doors | North Georgia',
    metaDescription:
      'Custom wood garage doors built and installed across North Georgia. Carriage house, cedar and stained doors sized to your opening. (770) 554-9990.',
    intro: [
      'Some houses need a real wood door. Lake Lanier homes, mountain houses up toward Cleveland and Dawsonville, farmhouses and craftsman builds — a stamped steel panel pretending to be wood does not do those elevations any favors.',
      'We build and install custom wood garage doors sized to your opening, in the style and stain you want. Carriage house with strap hardware, board-and-batten, stained cedar, painted panel — we work from what the house is asking for.',
      'Wood is a commitment. It is heavier, it costs more, and North Georgia humidity means it will want refinishing on a cycle. We would rather you hear that from us up front than find out in year four. If you want the look with less upkeep, we will show you the faux-wood options too and let you decide.',
    ],
    includes: [
      'Custom sizing for non-standard and oversized openings',
      'Carriage house, board-and-batten and raised-panel styles',
      'Cedar, hemlock and other species depending on the look and budget',
      'Stain and paint finishing options',
      'Decorative strap hinges, handles and glass',
      'Heavy-duty track, hardware and bearings rated for the weight',
      'Spring package sized to the finished wood door weight',
      'Opener assessment — wood doors often need a stronger unit',
      'Faux-wood steel and composite alternatives if you want the look with less upkeep',
    ],
    signsHeading: 'When a custom wood door makes sense',
    signs: [
      'The house is craftsman, farmhouse, cabin, lodge or historic in style',
      'A lake or mountain property where the elevation matters',
      'The opening is a non-standard size a stock door cannot cover',
      'An HOA or architectural review requires a specific look',
      'You want strap hardware and real depth in the panel, not a stamp',
      'You are matching an existing wood front door or shutters',
    ],
    process: [
      {
        title: 'Design conversation',
        detail:
          'We look at the house, talk through styles, species and finish, and figure out what actually fits the elevation.',
      },
      {
        title: 'Measure for a custom build',
        detail:
          'Wood doors are built to the opening. We measure the opening, headroom, backroom and sideroom, and check that the framing can carry the extra weight.',
      },
      {
        title: 'Quote and build',
        detail:
          'Written price covering the door, the finish, heavy-duty hardware, the correct spring package and installation.',
      },
      {
        title: 'Install and balance',
        detail:
          'Heavy-duty track and hardware, springs wound to the real finished weight, opener checked against the new load, and full weather sealing.',
      },
      {
        title: 'Care instructions',
        detail:
          'We tell you what the refinishing cycle looks like for the finish you chose and which side of the door takes the sun.',
      },
    ],
    faqs: [
      {
        question: 'How much maintenance does a wood door need in Georgia?',
        answer:
          'Plan on refinishing periodically — how often depends on the finish, the species, and how much direct sun and rain that elevation takes. A south- or west-facing door under no overhang works the hardest. We will tell you what to expect for your specific setup rather than quoting a number that will not hold.',
      },
      {
        question: 'Will my current opener handle a wood door?',
        answer:
          'Often not. Wood doors are considerably heavier than steel, and an opener sized for a light steel door will wear out fast. We check the opener as part of the quote so it is not a surprise later.',
      },
      {
        question: 'Can you match my front door or shutters?',
        answer:
          'Usually. Bring us a photo, and a sample or the stain name if you have it. We will get as close as the species allows and tell you honestly if an exact match is not realistic.',
      },
      {
        question: 'Is there a lower-maintenance option that still looks like wood?',
        answer:
          'Yes. Faux-wood steel and composite doors have come a long way and hold up better in humidity. They are not the same thing up close, but from the street on most houses they read as wood. We will show you both and let you make the call.',
      },
    ],
    heroImage: {
      src: '/images/wood-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Premium custom wooden garage door with decorative windows on a wooded North Georgia home.'
    },
    bodyImage: {
      src: '/images/wood-body.png',
      width: 1670,
      height: 941,
      alt: 'Premium custom wooden garage door with upper windows on a rustic green North Georgia home surrounded by trees.'
    },
    related: ['new-garage-doors', 'garage-door-installation', 'garage-door-repair'],
  },

  {
    slug: 'garage-door-removal-and-haul-away',
    name: 'Garage Door Takedown & Haul Away',
    shortName: 'Takedown & Haul Away',
    tier: 'secondary',
    icon: 'haul',
    summary: 'Old door and track removed safely — springs released, not cut — and hauled off your property.',
    metaTitle: 'Garage Door Removal & Haul Away | North Georgia',
    metaDescription:
      'Safe garage door takedown and haul away in North Georgia. Springs released properly, track and hardware removed and hauled off. (770) 554-9990.',
    intro: [
      'Sometimes you just need the old door gone. A remodel, a demo, a door damaged past repair, or a garage being converted into living space. We take doors down and haul them off.',
      'The reason to call somebody for this is the springs. A torsion spring above the door holds a great deal of stored energy whether the door works or not, and cutting the cables on a loaded spring is how people get badly hurt. We release the tension properly, then take the door apart in sections.',
      'Track, brackets, hardware and the opener come out too if you want them gone. Everything leaves on our truck.',
    ],
    includes: [
      'Safe release of torsion and extension spring tension',
      'Section-by-section door removal',
      'Track, brackets, shaft and hardware removal',
      'Opener and rail removal, including ceiling brackets',
      'Removal of doors already damaged, off-track or collapsed',
      'Haul away and disposal of all removed material',
      'Cleanup of the garage floor and opening',
      'Coordination with your framer, contractor or remodeler',
    ],
    signsHeading: 'When you need a takedown',
    signs: [
      'Converting the garage into a bedroom, office, gym or shop',
      'The door was hit and is bent, twisted or partly collapsed',
      'You are having new framing or a new opening built',
      'A tenant or previous owner left a dead door in place',
      'A contractor needs the opening clear before they can start',
      'You bought a new door elsewhere and just need the old one gone',
    ],
    process: [
      {
        title: 'Tell us the situation',
        detail:
          'Door size, whether it still moves, whether the opener is going too, and whether anything is already damaged or hanging.',
      },
      {
        title: 'Release the tension safely',
        detail:
          'Springs get unwound with winding bars, not cut. This is the whole reason not to do this one yourself.',
      },
      {
        title: 'Disassemble',
        detail:
          'The door comes apart section by section, then track, brackets, shaft and opener come down.',
      },
      {
        title: 'Haul and clean',
        detail:
          'Everything goes on the truck. We sweep the floor and the opening so the next trade can start.',
      },
    ],
    faqs: [
      {
        question: 'Can you take away a door I already removed?',
        answer:
          'Yes. If it is stacked in the garage or the driveway, we can pick it up. Call and tell us the size and how much hardware came with it.',
      },
      {
        question: 'Do you remove the opener too?',
        answer:
          'If you want it gone, yes — motor unit, rail, ceiling brackets, sensors and wall console. Some people keep the opener for the new door, so just tell us which.',
      },
      {
        question: 'What about a door that already fell or is off track?',
        answer:
          'That is a normal call for us. Do not try to wrestle it yourself — a partly collapsed door with a loaded spring is unpredictable. Leave it and let us handle it.',
      },
      {
        question: 'Can you take down and install the new door the same trip?',
        answer:
          'Yes, and that is the usual way when you are replacing. Takedown and haul away are already included in our installation pricing — this page is for when removal is the whole job.',
      },
    ],
    heroImage: {
      src: '/images/takedown-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Garage down takedown and haul away.'
    },
    bodyImage: {
      src: '/images/takedown-body.png',
      width: 1670,
      height: 941,
      alt: 'Take down and haul away garage door home in North Georgia.'
    },
    related: ['carport-to-garage-conversion', 'garage-door-installation', 'new-garage-doors'],
  },

  {
    slug: 'carport-to-garage-conversion',
    name: 'Carport to Garage Conversion',
    shortName: 'Carport Conversion',
    tier: 'secondary',
    icon: 'carport',
    summary: 'Turn an open carport into a closed, lockable garage — opening framed, door installed, sealed up.',
    metaTitle: 'Carport to Garage Conversion | North Georgia',
    metaDescription:
      'Convert your carport into a real garage in North Georgia. Opening framed, garage door installed, opener set up and sealed. Call (770) 554-9990.',
    intro: [
      'Plenty of North Georgia houses were built with a carport instead of a garage. Closing one in is one of the better returns you can get on a house — you gain secure, dry, lockable space, and the front of the house usually looks better for it.',
      'The garage door side of that job is what we do. We handle the door opening: framing the header and jambs so the opening is square and can carry the door, installing the door and track, setting up the opener, and sealing the perimeter so it is actually weather-tight.',
      'Every carport is a little different. Some have a slab and posts that make it straightforward. Others need real structural work before a door can go anywhere. We will come look at yours and tell you plainly which one you have, and where our work stops and a general contractor picks up.',
    ],
    includes: [
      'On-site assessment of the carport structure, slab and roofline',
      'Framing the door opening: header, jambs and door blocking',
      'Correct rough opening sizing for a standard or custom door',
      'Garage door supply and installation',
      'Track and spring package sized to the new door',
      'Opener installation, wiring coordination and setup',
      'Full perimeter weather sealing and bottom seal to the slab',
      'Coordination with your contractor, framer or electrician',
      'Honest scoping — we tell you what is outside our lane',
    ],
    signsHeading: 'What we look at first',
    signs: [
      'Whether the existing posts and beam can carry a door header',
      'Whether the slab is level enough for a door to seal against',
      'Headroom between the opening and the roof structure for track and opener',
      'Sideroom on each side for the vertical track',
      'Whether the opening is a standard door size or needs a custom door',
      'Where power is, and whether an electrician needs to run a circuit',
      'How the walls, if any, will be closed in around the opening',
    ],
    process: [
      {
        title: 'Site visit',
        detail:
          'We look at the structure, the slab, the roofline and the clearances, and tell you what the conversion actually involves.',
      },
      {
        title: 'Scope and quote',
        detail:
          'A written price for the framing of the opening, the door, the hardware and the opener — plus a clear note on anything you will need another trade for.',
      },
      {
        title: 'Frame the opening',
        detail:
          'Header, jambs and blocking set so the opening is square, plumb and strong enough to hang a door on.',
      },
      {
        title: 'Install the door',
        detail:
          'Door, track and springs installed and balanced, opener mounted and programmed.',
      },
      {
        title: 'Seal it up',
        detail:
          'Perimeter seal and a bottom seal set to the slab, so the space is dry and closed instead of just covered.',
      },
    ],
    faqs: [
      {
        question: 'Do I need a permit for a carport conversion?',
        answer:
          'Usually yes, since it involves structural framing and often electrical. Requirements differ between Hall, Forsyth, Jackson, Gwinnett, Dawson and White counties and the individual cities. Check with your local building department — we will tell you what the scope of work is so you know what to ask them.',
      },
      {
        question: 'Do you do the whole conversion, including the walls?',
        answer:
          'We do the garage door side of it: framing the door opening, the door, the hardware and the opener. Closing in the side walls, siding, electrical runs and any slab work are a general contractor and electrician job. We are glad to coordinate with yours, and we will be straight with you about where our part ends.',
      },
      {
        question: 'Will a standard door fit my carport?',
        answer:
          'Sometimes. Carport openings are frequently a non-standard width or height, in which case a custom door is the answer. We measure before anything gets ordered.',
      },
      {
        question: 'What if there is not enough headroom for a normal opener?',
        answer:
          'Low-headroom track and wall-mount jackshaft openers exist exactly for this. Carports often have a low roofline, so this comes up regularly and it is a solved problem.',
      },
    ],
    heroImage: {
      src: '/images/conversion-hero.png',
      width: 1423,
      height: 1105,
      alt: 'Carport to garage conversion.'
    },
    bodyImage: {
      src: '/images/conversion-body.png',
      width: 1670,
      height: 941,
      alt: 'Working on a carport to garage conversion in North GA.'
    },
    related: ['garage-door-installation', 'garage-door-removal-and-haul-away', 'garage-door-openers'],
  },
]

export const primaryServices = services.filter((s) => s.tier === 'primary')
export const secondaryServices = services.filter((s) => s.tier === 'secondary')

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug)
}

export function getServices(slugs: readonly string[]): Service[] {
  return slugs.map(getService).filter((s): s is Service => Boolean(s))
}
