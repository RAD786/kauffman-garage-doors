/**
 * Site-wide FAQs. These render on the homepage and feed the homepage FAQPage
 * schema. Service-specific questions live on the service entries in
 * `services.ts` so each service page gets its own FAQPage block.
 */

export type Faq = { question: string; answer: string }

export const generalFaqs: Faq[] = [
  {
    question: 'What areas do you serve?',
    answer:
      'We are based in Gainesville and cover Hall, Forsyth, Jackson, Gwinnett, Dawson and White counties, plus work down into the north Atlanta metro. That includes Flowery Branch, Oakwood, Buford, Cumming, Hoschton, Jefferson, Dawsonville and Cleveland. If you are near the edge of that, call and ask — we will give you a straight yes or no.',
  },
  {
    question: 'How much does a garage door repair cost?',
    answer:
      'It depends entirely on what failed. A roller set and a two-spring torsion system are not in the same range. What we will do is tell you the price before we start the work, not after. Call and describe the symptom and we can usually give you a realistic ballpark on the phone.',
  },
  {
    question: 'My spring broke. Can I still use the door?',
    answer:
      'No. Leave the door down and do not run the opener. The springs do the lifting, not the opener, and running it with a broken spring can bend the top section, snap a cable or pull the door off the track — turning a spring job into a much bigger one. If your car is shut inside, tell us when you call.',
  },
  {
    question: 'How soon can you get out here?',
    answer:
      'Call and we will tell you honestly what we have that day. We are a small family crew, not a franchise with twenty trucks, so we would rather give you a real time we can hit than a promise we cannot. Gainesville, Oakwood and Flowery Branch are typically the fastest.',
  },
  {
    question: 'Do you charge to come out and look?',
    answer:
      'Call us and ask — we will tell you exactly how our service call works before we schedule anything, so there is no surprise on the invoice. We do not do the thing where the number changes when the truck shows up.',
  },
  {
    question: 'Should I repair the door or replace it?',
    answer:
      'Most of the time, repair. Hardware is a wear item and a good steel door can last thirty years. Replacement makes sense when the bottom section is rusted through, panels are cracked at the hinge lines, the door has been hit, or replacement sections for that model are no longer made. We will tell you which situation you are in — including when the answer is the cheaper one.',
  },
  {
    question: 'Do you work on doors and openers you did not install?',
    answer:
      'Yes, and that is most of what we do. We service every common brand of door and opener, and plenty of the older ones that are no longer sold.',
  },
  {
    question: 'How long have you been in business?',
    answer:
      'Since 1984 — over forty years, family owned and operated, working out of Gainesville the whole time. We are not a national brand with a local phone number.',
  },
]
