/**
 * City pages are generated from this array. The goal for each entry is content
 * that could only have been written about that town -- county, ZIPs, housing
 * stock, landmarks. Swapping the city name into a template is how you get a
 * thin-content penalty, so every `intro` and `local` block below is specific.
 *
 * TODO(client): the neighborhood lists are the highest-value thing you can
 * improve here. Add the subdivisions you actually work in most.
 */

import { business } from './business'

/**
 * A real photo for a city page. Same rules as ServiceImage in services.ts:
 * drop the file in /public/images/, reference it WITHOUT the "/public" prefix,
 * and use the file's real pixel dimensions so nothing shifts as it loads.
 */
export type CityImage = {
  src: string
  width: number
  height: number
  /** Describe what is actually in the photo. Falls back to a generic label. */
  alt?: string
}

export type City = {
  slug: string
  /** City name only, no state. */
  name: string
  county: string
  zips: string[]
  /** True for the shop's home base -- gets slightly different copy and priority. */
  isHomeBase?: boolean
  /** Shown on the city page and used in schema `areaServed`. */
  metaTitle: string
  metaDescription: string
  /** Paragraphs. Written per-city, not templated. */
  intro: string[]
  /** "What we see in <city>" -- the housing-stock / local-conditions section. */
  localHeading: string
  local: string[]
  /** Recognizable places, used for the "areas we cover" line. Keep it factual. */
  landmarks: string[]
  /** Named subdivisions, roads and areas. */
  neighborhoods: string[]
  /**
   * Optional real photos. Leave either out and that slot keeps rendering the
   * dimensioned placeholder. heroImage sits beside the <h1>; bodyImage sits
   * above the FAQs. Local, recognisable shots work best here.
   */
  heroImage?: CityImage
  bodyImage?: CityImage
  /**
   * Two questions that could only be asked about this town. The city page also
   * renders two auto-generated, city-parameterised questions; keeping the rest
   * unique is what stops ten city pages sharing one FAQPage block.
   */
  faqs: { question: string; answer: string }[]
  /** Sort/priority weight for the sitemap. Home base highest. */
  priority: number
}

export const cities: City[] = [
  {
    slug: 'gainesville',
    name: 'Gainesville',
    county: 'Hall County',
    zips: ['30501', '30504', '30506', '30507'],
    isHomeBase: true,
    priority: 1.0,
    metaTitle: 'Garage Door Repair in Gainesville, GA | Kauffman',
    metaDescription:
      `Garage door repair, installation and openers in Gainesville, GA. Family run in Hall County since 1984. Call ${business.phone.display}.`,
    intro: [
      'Gainesville is home for us. We have been working on garage doors in Hall County since 1984, which means we have worked on doors in most parts of this town more than once — sometimes for the same family across two houses.',
      'Whatever your door is doing, we have almost certainly seen that exact failure on that exact model somewhere between Green Street and Chestnut Mountain. Springs, cables, openers, off-track doors, full replacements — call us and describe what it is doing.',
    ],
    localHeading: 'What we see on Gainesville doors',
    local: [
      'The housing stock here runs the full range, and each part of it fails differently. The older homes in the historic district around Green Street and Brenau often have single-car openings, wood doors, and framing that was never sized for a modern insulated door — those need measuring, not guessing.',
      'The subdivisions that went up around Lake Lanier and out toward Chestnut Mountain in the 90s and 2000s are hitting the age where the original builder-grade springs and openers give out. Those doors were frequently under-sprung when they were installed, which is why so many of them break at seven or eight years instead of fifteen.',
      'Lake proximity matters more than people expect. Humidity coming off Lanier is hard on rollers, hinges and bottom brackets, and it rusts the bottom section of a steel door from the inside out. If your door is close to the water and the bottom edge is bubbling, get it looked at before it eats through.',
      'We also do a fair amount of work for the poultry and light-industrial operations around town — bigger openings, higher cycle counts, and doors that get used dozens of times a day.',
    ],
    landmarks: [
      'Downtown Gainesville and the Green Street historic district',
      'Lake Lanier and the Olympic rowing venue at Clarks Bridge',
      'Northeast Georgia Medical Center',
      'Brenau University',
      'Chicopee Woods',
    ],
    heroImage: {
      src: '/images/gainesville-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Daytime photo of City of Gainesville GA city hall building',
    },
    bodyImage: {
      src: '/images/gainesville-body.png',
      width: 1670,
      height: 941,
      alt: 'Spring time aerial shot of downtown Gainesville GA',
    },
    neighborhoods: [
      'Green Street Historic District',
      'Chestnut Mountain',
      'Chicopee',
      'Lakeshore',
      'Mundy Mill',
      'New Holland',
      'Riverside',
      'Sardis',
    ],
    faqs: [
      {
        question: 'Why does my door near Lake Lanier keep rusting at the bottom?',
        answer:
          'Humidity off the lake gets into the bottom section and works upward from the inside, and it corrodes rollers, hinges and bottom brackets along with it. If the bottom edge is bubbling or flaking, get it looked at before it perforates — at that point the section is done and no amount of paint brings it back. Doors a few streets back from the water hold up much better.',
      },
      {
        question: 'Do you work on commercial and poultry-plant doors in Gainesville?',
        answer:
          'Yes. We do a fair amount of work for the poultry and light-industrial operations around town. Those are bigger openings with far higher cycle counts than a house, so they need heavier spring packages and more frequent hardware checks. A residential-rated spring on a door cycling forty times a day will not last a year.',
      },
    ],
  },

  {
    slug: 'flowery-branch',
    name: 'Flowery Branch',
    county: 'Hall County',
    zips: ['30542'],
    priority: 0.9,
    metaTitle: 'Garage Door Repair in Flowery Branch, GA | Kauffman',
    metaDescription:
      `Garage door repair, springs, openers and new doors in Flowery Branch, GA. Family run North Georgia shop since 1984. Call ${business.phone.display}.`,
    intro: [
      'Flowery Branch is a short run south of our home base in Gainesville, so it is one of the areas we cover most often. We handle garage door repair, spring replacement, opener work and full door replacement throughout the 30542 area.',
      'Whether you are in one of the newer subdivisions off Spout Springs Road or in an older house closer to the historic downtown, call and tell us what the door is doing.',
    ],
    localHeading: 'What we see on Flowery Branch doors',
    local: [
      'Flowery Branch has grown a lot, and most of that growth is subdivisions built in the last twenty-five years. That is a very specific kind of garage door work: builder-grade doors, standard-size double openings, and hardware that was installed as cheaply as the spec allowed.',
      'Those doors reach a predictable age and then the springs, rollers and opener gears go within a couple of years of each other. If you are in a neighborhood where your neighbors have all had garage door people out lately, that is not a coincidence — the whole street was built the same year with the same parts.',
      'The lakefront and near-lake properties get the humidity problem: rust on the bottom section, corroded rollers and hinges, and weather seal that goes brittle. Doors that face west toward the water take the worst of the sun as well.',
      'Spout Springs Road and the newer construction around it means we also see a steady amount of new-build and warranty-age work here.',
    ],
    landmarks: [
      'Historic downtown Flowery Branch',
      'Lake Lanier and the Flowery Branch marina area',
      'The Atlanta Falcons training facility',
      'Spout Springs Road corridor',
      'Cherokee Bluffs',
    ],
    heroImage: {
      src: '/images/flowery-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Flowery Branch GA home with new premium garage door.',
    },
    bodyImage: {
      src: '/images/flowery-body.png',
      width: 1670,
      height: 941,
      alt: 'Aerial shot of homes in Flowery Branch on the lake.',      
    },
    neighborhoods: [
      'Sterling on the Lake',
      'Reunion',
      'Royal Lakefront',
      'Cherokee Bluffs',
      'Spout Springs',
      'Mulberry Park',
      'Old Town Flowery Branch',
    ],
    faqs: [
      {
        question: 'My whole street is having garage door problems at once. Why?',
        answer:
          'Because the whole street was built the same year with the same parts. Most of Flowery Branch went up as subdivisions over the last twenty-five years, and builder-grade springs and opener gears reach the end of their cycle life at roughly the same time. It is not a coincidence and it is not a defect — it is just the hardware aging out together.',
      },
      {
        question: 'We are in a newer build off Spout Springs. Is the door still under warranty?',
        answer:
          'Possibly on the door sections, but spring and hardware coverage is usually much shorter than people expect and often excludes wear items entirely. Tell us the builder and roughly when the house closed and we will tell you honestly whether it is worth chasing the warranty before you pay us.',
      },
    ],
  },

  {
    slug: 'oakwood',
    name: 'Oakwood',
    county: 'Hall County',
    zips: ['30566'],
    priority: 0.9,
    metaTitle: 'Garage Door Repair in Oakwood, GA | Kauffman',
    metaDescription:
      `Garage door repair, opener service and new door installation in Oakwood, GA. Local Hall County family business since 1984. ${business.phone.display}.`,
    intro: [
      'Oakwood sits right between Gainesville and Flowery Branch, so it is about as close to our home base as a job gets. Repairs, springs, openers, new doors — we cover the whole 30566 area.',
      'Small town, straightforward work. Call us, tell us what the door is doing, and we will tell you what it needs.',
    ],
    localHeading: 'What we see on Oakwood doors',
    local: [
      'Oakwood is a mix that keeps the work interesting: older homes along the original town streets, a good amount of 1990s and 2000s subdivision building, and a commercial and light-industrial stretch along the I-985 corridor.',
      'The older houses tend to have single-car openings and, in some cases, doors old enough that replacement sections simply are not manufactured any more. When we get to a door like that we will tell you straight whether it is repairable or whether you are better off putting the money toward a new one.',
      'The subdivision doors are the standard story — original builder springs and openers reaching the end of their cycle life at roughly the same time across a whole neighborhood.',
      'With the University of North Georgia campus here, we also do a fair amount of rental and landlord work, which usually means "make it safe and make it reliable" rather than "make it pretty." That is fine by us.',
    ],
    landmarks: [
      'University of North Georgia, Gainesville campus',
      'The I-985 corridor',
      'Downtown Oakwood',
      'Lanier Technical College area',
    ],
    heroImage: {
      src: '/images/oakwood-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/oakwood-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },
    neighborhoods: [
      'Thurmon Tanner corridor',
      'Allen Creek',
      'Mundy Mill',
      'Winder Highway area',
      'Downtown Oakwood',
    ],
    faqs: [
      {
        question: 'Do you handle rental properties around the UNG campus?',
        answer:
          'Regularly. Landlord and property-manager work here is usually "make it safe and make it reliable" rather than "make it pretty," which is fine by us. We can coordinate access with a tenant and bill the owner, and we will tell you when a repair will not survive another tenant cycle.',
      },
      {
        question: 'My door is old and I cannot find replacement panels. What now?',
        answer:
          'That is common on the older houses along the original town streets. Once a section is discontinued, a cosmetic repair is patchwork and a colour match is unlikely. We will tell you plainly whether the door is still safe to run as-is or whether the money is better spent on a replacement rather than chasing parts that are not made.',
      },
    ],
  },

  {
    slug: 'buford',
    name: 'Buford',
    county: 'Gwinnett & Hall Counties',
    zips: ['30518', '30519'],
    priority: 0.9,
    metaTitle: 'Garage Door Repair in Buford, GA | Kauffman',
    metaDescription:
      `Garage door repair, spring replacement and installation in Buford, GA. Serving 30518 and 30519 since 1984. Call ${business.phone.display}.`,
    intro: [
      'Buford straddles the Gwinnett and Hall county line, and we work both sides of it. Garage door repair, broken springs, opener replacement and new door installation across 30518 and 30519.',
      'Call and describe the problem — most of the time we can narrow it down over the phone and bring the right parts on the first trip.',
    ],
    localHeading: 'What we see on Buford doors',
    local: [
      'Buford has two distinct kinds of housing and they need different things. The historic core around Main Street has older homes, detached garages and non-standard openings — those jobs need somebody to actually measure and think, because stock sizes often will not fit.',
      'Then there is everything that has gone up around the Mall of Georgia and out toward Hamilton Mill over the last twenty-five years: large subdivisions, mostly double-car doors, all built to the same spec in the same few years. Those come to us as spring failures, worn rollers and dead opener gears, and they come in waves as each neighborhood hits its age.',
      'The larger homes on the Hall County side and near Lake Lanier tend to have three-car configurations, heavier insulated or carriage-house doors, and openers that were undersized for the door weight from the start.',
      'Because Buford draws a lot of commuters, we hear "the car is stuck inside and I have to be at work" more here than almost anywhere else. Tell us that when you call and we will factor it into the schedule.',
    ],
    landmarks: [
      'Mall of Georgia',
      'Historic Main Street Buford',
      'Lake Lanier and Buford Dam',
      'Hamilton Mill',
      'Bogan Park',
    ],
    heroImage: {
      src: '/images/buford-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/buford-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },    
    neighborhoods: [
      'Hamilton Mill',
      'Ivy Creek',
      'Sardis Ridge',
      'Downtown Buford / Main Street',
      'Lanier Golf area',
      'Bogan Road corridor',
    ],
    faqs: [
      {
        question: 'My garage is on historic Main Street and the opening is an odd size.',
        answer:
          'That is the norm in the older core, and a stock door will not cover it. Those openings need measuring rather than a catalogue number, and sometimes a custom-width door. Low headroom is also common in that housing, which can mean low-clearance track or a wall-mount opener instead of a standard ceiling unit.',
      },
      {
        question: 'We have a three-car garage. Do all the doors need work at once?',
        answer:
          'Usually not. On the larger Hall-side and near-lake homes the double door does most of the cycling and the single barely gets used, so they wear at completely different rates. We will tell you if only one needs attention. What we do check is whether the opener was sized for the heavier insulated or carriage-house door it is actually lifting.',
      },
    ],
  },

  {
    slug: 'cumming',
    name: 'Cumming',
    county: 'Forsyth County',
    zips: ['30040', '30041', '30028'],
    priority: 0.9,
    metaTitle: 'Garage Door Repair in Cumming, GA | Kauffman',
    metaDescription:
      `Garage door repair, openers, springs and new doors in Cumming and Forsyth County, GA. Family run since 1984. Call ${business.phone.display}.`,
    intro: [
      'We cover Cumming and the surrounding Forsyth County area — 30040, 30041 and 30028. Garage door repair, spring replacement, opener installation and full door replacement.',
      'Forsyth County has grown faster than almost anywhere in Georgia, and a lot of that growth is now old enough to need its first real garage door service. If your door is doing something it did not use to do, give us a call.',
    ],
    localHeading: 'What we see on Cumming doors',
    local: [
      'Cumming is subdivision country, and the timing of that construction shows up directly in our schedule. Neighborhoods built in the late 90s and 2000s are now on their second or third set of springs and their first or second opener. Neighborhoods built in the 2010s are hitting first-spring-failure territory right about now.',
      'Larger Forsyth County homes commonly have three-car garages with a double door and a single, and it is very common for those two doors to be at completely different stages of wear because the single gets used far less. We will tell you honestly if only one of them needs work.',
      'The homes out toward Lake Lanier on the eastern side of the county get the same humidity and rust issues we see on the Hall County side — bottom sections, rollers and hinges take the brunt of it.',
      'Cumming also has a lot of side-entry and courtyard-entry garages, which look great and mean the door is often visible from the street at an angle. When people here replace a door, appearance is usually part of the reason.',
    ],
    landmarks: [
      'Downtown Cumming and the Cumming City Center',
      'Lake Lanier, western shoreline',
      'Sawnee Mountain Preserve',
      'The GA-400 corridor',
      'The Collection at Forsyth',
    ],
    heroImage: {
      src: '/images/cumming-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/cumming-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },        
    neighborhoods: [
      'Vickery Village',
      'Windermere',
      'Polo Golf & Country Club',
      'Lanier Beach South',
      'Sawnee Mountain area',
      'Post Road corridor',
      'Matt / north Forsyth',
    ],
    faqs: [
      {
        question: 'Our two garage doors are the same age but only one is failing.',
        answer:
          'Very common in Forsyth County three-car garages. The double door gets used every day and the single might open twice a month, so the springs on the double reach their cycle limit years earlier. We will not sell you two spring jobs when one door is fine.',
      },
      {
        question: 'Our garage faces the street at an angle. Does that change anything?',
        answer:
          'It changes what matters to you. Side-entry and courtyard-entry garages are common here, and the door is visible from the road, so appearance is usually part of why people replace rather than repair. If that is your situation, say so — it moves the conversation toward panel style and colour rather than the cheapest hardware fix.',
      },
    ],
  },

  {
    slug: 'hoschton',
    name: 'Hoschton',
    county: 'Jackson County',
    zips: ['30548'],
    priority: 0.8,
    metaTitle: 'Garage Door Repair in Hoschton, GA | Kauffman',
    metaDescription:
      `Garage door repair, springs, openers and installation in Hoschton, GA and the 30548 area. Family run since 1984. Call ${business.phone.display}.`,
    intro: [
      'We serve Hoschton and the surrounding Jackson County area, including the neighborhoods around Braselton and Chateau Elan. Repairs, springs, openers and new door installation.',
      'Call us and describe what the door is doing. We will tell you what it likely is before we ever get in the truck.',
    ],
    localHeading: 'What we see on Hoschton doors',
    local: [
      'Hoschton has changed a great deal. There is the original small town, and then there is the substantial amount of newer residential development that has filled in around it and out toward Braselton over the past two decades.',
      'The active-adult and newer subdivision communities in this area are a large part of our work here. Those doors are generally well-maintained, which means when something goes wrong it is usually a single clear failure — a spring, a roller set, an opener gear — rather than years of neglect stacked up.',
      'The larger homes around the Chateau Elan area often have three-car garages, carriage-house style doors and heavier insulated panels. Those need springs and openers sized to the real weight, and we see plenty that were not.',
      'Out on the more rural end of the county there are detached shops and outbuildings with older or oversized doors. We do those too — including doors wide enough that a stock replacement will not cover the opening.',
    ],
    landmarks: [
      'Downtown Hoschton',
      'Chateau Elan area',
      'Braselton',
      'Mulberry River area',
      'The I-85 / GA-53 corridor',
    ],
    heroImage: {
      src: '/images/hoschton-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/hoschton-body.png',
      width: 1672,
      height: 941,
      alt: 'Oakwood city hall.',      
    },       
    neighborhoods: [
      'Del Webb Chateau Elan',
      'Twin Lakes',
      'Village at Deaton Creek',
      'Downtown Hoschton',
      'Braselton border neighborhoods',
      'Rural Jackson County',
    ],
    faqs: [
      {
        question: 'Do you work in the Del Webb and Village at Deaton Creek communities?',
        answer:
          'Yes, and they are a good chunk of our Hoschton work. Those doors are generally well maintained, so when something goes wrong it is usually one clear failure — a spring, a roller set, an opener gear — rather than years of neglect stacked up. That tends to make for a quick, single-visit repair.',
      },
      {
        question: 'I have an oversized door on a shop out in the county. Can you cover it?',
        answer:
          'Yes. Rural Jackson County has plenty of detached shops and outbuildings with openings wider or taller than anything stock. Those need a custom door and often a commercial-grade spring package rather than a residential one. Measure the opening roughly and call us with the numbers.',
      },
    ],
  },

  {
    slug: 'jefferson',
    name: 'Jefferson',
    county: 'Jackson County',
    zips: ['30549'],
    priority: 0.8,
    metaTitle: 'Garage Door Repair in Jefferson, GA | Kauffman',
    metaDescription:
      `Garage door repair, spring replacement, openers and new doors in Jefferson, GA. Family run North Georgia shop since 1984. ${business.phone.display}.`,
    intro: [
      'Jefferson is the Jackson County seat, and we cover it and the surrounding area for garage door repair, spring replacement, opener work and new door installation.',
      'Houses in town, newer subdivisions, and shops and outbuildings out in the county — we handle all of it. Call and tell us what you have.',
    ],
    localHeading: 'What we see on Jefferson doors',
    local: [
      'Jefferson has a genuine older core with houses that predate attached garages entirely. Those properties usually have a detached garage or a converted outbuilding, often with a non-standard opening and hardware that has been patched together over decades. Those are our favorite kind of puzzle, and they almost always need measuring rather than a catalog number.',
      'Around that core is a steady amount of newer subdivision building, driven partly by the schools and the I-85 access. Those are standard double doors with builder-grade hardware, and they fail on the usual schedule.',
      'The rural parts of the county are full of shops, barns and equipment buildings with wide openings. We do oversized doors, and we can tell you when an opening needs a commercial-grade spring package rather than a residential one.',
      'North Georgia weather is the constant here as everywhere: humid summers that corrode hardware, and the occasional hard freeze that finishes off a spring already near the end of its cycle life.',
    ],
    landmarks: [
      'Downtown Jefferson and the Jackson County courthouse',
      'Crawford W. Long Museum',
      'The I-85 corridor',
      'Jefferson city schools area',
      'Curry Creek',
    ],
    heroImage: {
      src: '/images/jefferson-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/jefferson-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },        
    neighborhoods: [
      'Downtown Jefferson',
      'Traditions of Braselton area',
      'Old Pendergrass Road corridor',
      'Dry Pond',
      'Rural Jackson County',
    ],
    faqs: [
      {
        question: 'My detached garage is older than the house and nothing about it is standard.',
        answer:
          'Those are our favourite kind of job, honestly. Jefferson has a real older core with detached garages and converted outbuildings where the hardware has been patched together over decades. There is no catalogue number for that — it gets measured, and we tell you what can be reused and what has to go.',
      },
      {
        question: 'Do you do barns and equipment buildings, not just houses?',
        answer:
          'Yes. Wide openings on barns and equipment buildings are routine out in the county. The key question is whether the opening needs a commercial-grade spring package instead of a residential one, which depends on the door weight and how often it cycles. We will tell you which side of that line you are on.',
      },
    ],
  },

  {
    slug: 'dawsonville',
    name: 'Dawsonville',
    county: 'Dawson County',
    zips: ['30534'],
    priority: 0.8,
    metaTitle: 'Garage Door Repair in Dawsonville, GA | Kauffman',
    metaDescription:
      `Garage door repair, springs, openers and new door installation in Dawsonville and Dawson County, GA. Since 1984. Call ${business.phone.display}.`,
    intro: [
      'We cover Dawsonville and Dawson County for garage door repair, spring replacement, opener service and new door installation.',
      'This is mountain country, and the properties out here are not all cookie-cutter. Call us with what you have and we will tell you how we would approach it.',
    ],
    localHeading: 'What we see on Dawsonville doors',
    local: [
      'Dawson County splits pretty cleanly between the newer residential growth along the GA-400 corridor near the outlets, and the more rural and mountain properties out toward Amicalola and the north end of the county.',
      'The 400-corridor subdivisions are conventional work — standard openings, builder-grade doors, springs and openers aging out together.',
      'The mountain and lake properties are a different job. Cabins and larger custom homes here often have wood or carriage-house doors chosen to suit the setting, sometimes on steep or awkward driveways, sometimes with detached garages and shops. Those doors are heavier than they look, and we regularly find them running on springs and openers that were sized for something lighter.',
      'Elevation matters for weather too. The north end of the county gets colder and gets ice more often than Gainesville does, and cold is what finishes off a tired spring. Doors that sit exposed with no overhang also go through weather seal faster.',
      'Detached shops and outbuildings are common out here, and a lot of them have wide or tall openings that need a custom door rather than a stock one.',
    ],
    landmarks: [
      'North Georgia Premium Outlets',
      'Amicalola Falls State Park',
      'Downtown Dawsonville',
      'The GA-400 corridor',
      'Lake Lanier, northern end',
    ],
    heroImage: {
      src: '/images/dawsonville-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Kauffman service tech working on a garage door repair.',      
    },
    bodyImage: {
      src: '/images/dawsonville-body.png',
      width: 1672,
      height: 941,
      alt: 'Aerial shot of a wooded setting in Dawsonville, GA.',      
    },     
    neighborhoods: [
      'Downtown Dawsonville',
      'GA-400 corridor',
      'Big Canoe area',
      'Amicalola / north Dawson County',
      'Lake Lanier north shore',
    ],
    faqs: [
      {
        question: 'Why do springs seem to break here on the first cold morning?',
        answer:
          'The cold did not cause it — it picked the day. A spring already near the end of its cycle life is less forgiving when steel is cold, and the north end of Dawson County gets colder and ices more often than Gainesville does. If your door is slow or heavy through the autumn, that is the warning.',
      },
      {
        question: 'We have a cabin with heavy wood doors on a steep driveway.',
        answer:
          'Common up here, and the thing we most often find is that the springs and opener were sized for something lighter than the door actually is. Wood and carriage-house doors weigh considerably more than the steel doors those parts were rated for. A steep or awkward approach also means telling us about access before we load the truck.',
      },
    ],
  },

  {
    slug: 'cleveland',
    name: 'Cleveland',
    county: 'White County',
    zips: ['30528'],
    priority: 0.8,
    metaTitle: 'Garage Door Repair in Cleveland, GA | Kauffman',
    metaDescription:
      `Garage door repair, spring replacement and new doors in Cleveland and White County, GA. Family run since 1984. Call ${business.phone.display}.`,
    intro: [
      'We serve Cleveland and White County for garage door repair, springs, openers and new door installation.',
      'Cleveland is a straight run north from Gainesville, so it has been part of our territory for a long time. Call and tell us what the door is doing.',
    ],
    localHeading: 'What we see on Cleveland doors',
    local: [
      'White County is mountain country, and the housing reflects that. There are the in-town Cleveland homes, and then there is everything spread out through the hills — cabins, custom mountain homes, and a lot of properties with detached garages, shops and outbuildings.',
      'Mountain properties are hard on doors in ways flatland properties are not. Steeper grades mean driveways that pitch toward the garage and slabs that do not always meet the door squarely, which chews through bottom seal and lets water in. Doors on exposed elevations take more wind and more direct weather.',
      'Cleveland and the areas up toward Helen sit at enough elevation to get colder than Gainesville and to see ice more often. Cold does not cause spring failure, but it reliably picks the day for a spring that was already at the end of its cycle life.',
      'Cabins and rental properties in this area often have wood or wood-look doors that suit the setting. Those are heavier, and they need springs and an opener sized to the real weight — something we find has often been skipped.',
      'Because a lot of these are second homes and short-term rentals, we get a fair number of calls from owners who are not local. Tell us that on the phone and we will work out access with you.',
    ],
    landmarks: [
      'Downtown Cleveland and the White County courthouse square',
      'BabyLand General Hospital',
      'Truett McConnell University',
      'Helen, just north',
      'Yonah Mountain',
    ],
    heroImage: {
      src: '/images/cleveland-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/cleveland-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },    
    neighborhoods: [
      'Downtown Cleveland',
      'Yonah Mountain area',
      'Sautee Nacoochee',
      'Helen corridor',
      'Rural White County',
    ],
    faqs: [
      {
        question: 'It is a second home or short-term rental and I am not local. How does that work?',
        answer:
          'Tell us on the phone and we will work out access with you — lockbox, a neighbour, a cleaner, whatever you have. A lot of our White County work is for owners who are somewhere else. We will send you photos of what we found rather than asking you to take our word for it.',
      },
      {
        question: 'Water keeps getting under my garage door. Why?',
        answer:
          'Mountain lots often pitch toward the garage, and the slab does not always meet the door squarely. That chews through bottom seal fast and lets water in even when the door looks shut. The fix is usually a proper threshold seal plus a bottom seal matched to the actual gap, not just a thicker strip of rubber.',
      },
    ],
  },

  {
    slug: 'atlanta',
    name: 'Atlanta',
    county: 'Fulton, DeKalb & north metro',
    zips: ['30305', '30319', '30326', '30328', '30338', '30342', '30350'],
    priority: 0.7,
    metaTitle: 'Garage Door Repair in Atlanta, GA | Kauffman',
    metaDescription:
      `Garage door repair, custom wood doors and installation in Atlanta and the north metro. A North Georgia family shop since 1984. ${business.phone.display}.`,
    intro: [
      'We work down into Atlanta and the north metro from our base in Gainesville. Garage door repair, spring replacement, opener installation, new doors and custom wood doors.',
      'Because Atlanta is the far end of our territory rather than the middle of it, call us first and tell us where you are and what you need. We will give you a straight answer about scheduling instead of a maybe.',
    ],
    localHeading: 'What we see on Atlanta doors',
    local: [
      'Atlanta is a much older and much more varied housing stock than the counties north of it, and that changes the work. Intown neighborhoods have bungalows and pre-war homes with detached garages, alley access, single-car openings and framing that was never intended for a modern door.',
      'Those are jobs where the measurement is the whole game. A stock double door does not go into a 1930s opening, and low headroom is common enough that low-clearance track and wall-mount jackshaft openers come up regularly.',
      'The north metro — Sandy Springs, Dunwoody, Brookhaven, Buckhead — has a lot of larger homes with three-car garages, heavy insulated or carriage-house doors, and appearance that genuinely matters. That is where our custom wood door work tends to land.',
      'Being a small family shop out of Gainesville, we are not the company that will be there in thirty minutes for an Atlanta emergency, and we will not pretend otherwise. Where we are a good fit is planned work: a new door, a custom wood door, a replacement you want done right by someone who will pick up the phone afterward.',
    ],
    landmarks: [
      'Buckhead',
      'Sandy Springs',
      'Dunwoody and Brookhaven',
      'The I-285 north perimeter',
      'The GA-400 corridor',
    ],
    heroImage: {
      src: '/images/atlanta-hero.png',
      width: 1422,
      height: 1106,
      alt: 'Service tech working on a garage door.',      
    },
    bodyImage: {
      src: '/images/atlanta-body.png',
      width: 1670,
      height: 941,
      alt: 'Oakwood city hall.',      
    },    
    neighborhoods: [
      'Buckhead',
      'Sandy Springs',
      'Dunwoody',
      'Brookhaven',
      'Chamblee',
      'Roswell / Alpharetta corridor',
    ],
    faqs: [
      {
        question: 'My 1930s garage has almost no headroom above the opening.',
        answer:
          'That is the single most common thing we run into intown, and it is a solved problem. Low-clearance track and wall-mount jackshaft openers exist exactly for this. What does not work is forcing a standard track and opener into the space and hoping — that is how you end up with a door that binds and an opener that burns out.',
      },
      {
        question: 'Can you get to me quickly for an Atlanta emergency?',
        answer:
          'Honestly, probably not — and we would rather say so than waste your afternoon. We run out of Gainesville, so Atlanta is the far end of our territory, not the middle of it. Where we are a good fit down here is planned work: a new door, a custom wood door, a replacement you want done properly by someone who picks up the phone afterward.',
      },
    ],
  },
]

export function getCity(slug: string): City | undefined {
  return cities.find((c) => c.slug === slug)
}

/** Home base first, then by priority, then alphabetical -- used for nav and footer lists. */
export const citiesByPriority = [...cities].sort(
  (a, b) => b.priority - a.priority || a.name.localeCompare(b.name)
)

/** Every county we touch, deduped -- used in schema `areaServed` and footer copy. */
export const counties = Array.from(new Set(cities.map((c) => c.county)))
