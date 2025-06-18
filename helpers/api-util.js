// 🔁 This function can be used in Static Site Generation (SSG) via getStaticProps()
// to pre-render pages with event data during build time.
//
// 🟢 Later, client-side data fetching (CSR) can also be used to revalidate or update the data in real-time
// (e.g., using useEffect or SWR on the client), allowing a hybrid approach:
// ✅ fast initial load from pre-rendered content
// ✅ and up-to-date data via client-side updates

export async function getAllEvents() {
  const response = await fetch(
    'https://nextjs-demo-db629-default-rtdb.firebaseio.com/events.json'
  );
  const data = await response.json();

  // {
  //   "e1": {
  //     "title": "Programming for everyone",
  //     "date": "2021-05-12",
  //     "description": "Everyone can learn to code! Yes, everyone! In this live event, we are going to go through all the key basics and get you started with programming as well.",
  //     "image": "images/coding-event.jpg",
  //     "isFeatured": false,
  //     "location": "Somestreet 25, 12345 San Somewhereo"
  //   },
  //   "e2": {
  //     "title": "Networking for introverts",
  //     "date": "2021-05-30",
  //     "description": "We know: Networking is no fun if you are an introvert person. That's why we came up with this event - it'll be so much easier. Promised!",
  //     "image": "images/introvert-event.jpg",
  //     "isFeatured": true,
  //     "location": "New Wall Street 5, 98765 New Work"
  //   }
  // }

  const events = [];

  for (const key in data) {
    events.push({
      id: key,
      ...data[key],
    });
  }

  // [
  //   {
  //     id: 'e1',
  //     title: 'Programming for everyone',
  //     date: '2021-05-12',
  //     description: 'Everyone can learn to code!...',
  //     image: 'images/coding-event.jpg',
  //     isFeatured: false,
  //     location: 'Somestreet 25, 12345 San Somewhereo',
  //   },
  //   {
  //     id: 'e2',
  //     title: 'Networking for introverts',
  //     date: '2021-05-30',
  //     description: 'We know: Networking is no fun...',
  //     image: 'images/introvert-event.jpg',
  //     isFeatured: true,
  //     location: 'New Wall Street 5, 98765 New Work',
  //   },
  //   // ...
  // ];

  return events;
}

// This function filters the full list of events to return only the featured ones.
// Can be used in getStaticProps or getStaticPaths to pre-generate only specific pages.
export async function getFeaturedEvents() {
  const allEvents = await getAllEvents();
  return allEvents.filter((event) => event.isFeatured);
}

export async function getEventById(id) {
  const allEvents = await getAllEvents();
  return allEvents.find((event) => event.id === id);
}

// 📌 Returns events that match a specific year and month
// The dateFilter parameter should be an object: { year: number, month: number }
// Note: JavaScript months are 0-based, so we subtract 1 from the given month
export async function getFilteredEvents(dateFilter) {
  const { year, month } = dateFilter;

  const allEvents = await getAllEvents();

  let filteredEvents = allEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      // Compare the event's year and month:
      // - getFullYear() returns the full year (e.g., 2022)
      // - getMonth() returns a zero-based month (0 = January, 11 = December),
      //   so we subtract 1 from the input month to match the Date object's format
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    );
  });

  return filteredEvents;
  // getFilteredEvents({ year: 2022, month: 4 });

  // Result:
  // [
  //   {
  //     id: 'e3',
  //     title: 'Networking for extroverts',
  //     date: '2022-04-10',
  //     ...
  //   }
  // ]
}
