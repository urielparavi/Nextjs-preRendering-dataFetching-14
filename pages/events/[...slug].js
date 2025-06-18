// 📌 Difference between Catch-all and Optional Catch-all routes in Next.js:
//
// ✅ Catch-all route: [...slug]
// - Matches URLs with *at least one* segment after the base path.
// - Example: pages/blog/[...slug].js matches:
//     /blog/react
//     /blog/react/hooks
// - But does NOT match: /blog
//
// ✅ Optional Catch-all route: [[...slug]]
// - Matches the base path *and* any number of segments after it.
// - Example: pages/blog/[[...slug]].js matches:
//     /blog
//     /blog/react
//     /blog/react/hooks
//
// 🧠 Note: In both cases, `slug` is an array. In the optional version, if no segments are provided, `slug` is undefined.

import { getFilteredEvents } from '../../helpers/api-util';
import EventList from '../../components/events/event-list';
import ResultsTitle from '../../components/events/results-title';
import Button from '../../components/ui/button';
import ErrorAlert from '../../components/ui/error-alert';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import Head from 'next/head';

// 🔁 Fetcher function (can be moved to a separate file)
const fetcher = (url) =>
  fetch(url).then((res) => {
    if (!res.ok) {
      throw new Error('Failed to fetch');
    }
    return res.json();
  });

function FilteredEventsPage(props) {
  const [loadedEvents, setLoadedEvents] = useState();
  const router = useRouter();

  const filterData = router.query.slug;
  // console.log(filterData); // Output: ["2021", "5"]

  const { data, error } = useSWR(
    'https://nextjs-demo-db629-default-rtdb.firebaseio.com/events.json',
    fetcher // ✅ Pass the fetcher function here
  );

  useEffect(() => {
    if (data) {
      const events = [];

      for (const key in data) {
        events.push({
          id: key,
          ...data[key],
        });
      }

      setLoadedEvents(events);
    }
  }, [data]);

  let pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta name="description" content={`A list of filtered events.`} />
    </Head>
  );

  // ⚠️ NOTE: This behavior only applies to the **old Page Router** (Next.js ≤ 13).
  // - When using useRouter().query.slug, the value is initially `undefined`
  //   during the first render on the client side.
  // - It gets populated only after hydration (once the router is ready).
  //
  // ✅ In the **new App Router** (Next.js 13+ with /app folder):
  // - You no longer use useRouter().query.
  // - Route parameters (like [...slug]) are passed directly to the `params` object
  //   in the Page function (Server Component) — and are always defined during render.
  //

  // ⚠️ This check is needed only when using the old Page Router (Next.js ≤ 13).
  // On the first render, router.query.slug is undefined because it's a client-side value.
  // We display a loading state until the query params become available after hydration.
  if (!loadedEvents) {
    return (
      <>
        {pageHeadData}
        <p className="center">Loading...</p>
      </>
    );
  }

  // Output: ["2021", "5"]
  const filteredYear = filterData[0]; // ["2021", "5"] => "2021"
  const filteredMonth = filterData[1]; // ["2021", "5"] => "5"

  const numYear = +filteredYear; // 2021
  const numMonth = +filteredMonth; // 5

  pageHeadData = (
    <Head>
      <title>Filtered Events</title>
      <meta
        name="description"
        content={`All events for ${numMonth}/${numYear}`}
      />
    </Head>
  );

  // Validate the extracted year and month parameters:
  // - Check if either is NaN (not a number)
  // - Check if the year is outside the allowed range (2021 to 2030)
  // - Check if the month is outside the valid range (1 to 12)
  // If any check fails, show an error message to the user.
  if (
    isNaN(numYear) ||
    isNaN(numMonth) ||
    numYear > 2030 ||
    numYear < 2021 ||
    numMonth < 1 ||
    numMonth > 12
    // props.hasError
  ) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>Invalid filter. Please adjust your values!</p>
        </ErrorAlert>

        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const filteredEvents = loadedEvents.filter((event) => {
    const eventDate = new Date(event.date);
    return (
      // Compare the event's year and month:
      // - getFullYear() returns the full year (e.g., 2022)
      // - getMonth() returns a zero-based month (0 = January, 11 = December),
      //   so we subtract 1 from the input month to match the Date object's format
      eventDate.getFullYear() === numYear &&
      eventDate.getMonth() === numMonth - 1
    );
  });

  // Get events filtered by the specified year and month
  // const filteredEvents = props.events;
  // Result:
  // [
  //   {
  //     id: 'e3',
  //     title: 'Networking for extroverts',
  //     date: '2022-04-10',
  //     ...
  //   },
  //   ...
  // ]

  // Check if the filteredEvents array is missing or empty:
  // - If getFilteredEvents() returned undefined/null (just to be safe)
  // - Or if it returned an empty array with no matching events
  if (!filteredEvents || filteredEvents.length === 0) {
    return (
      <>
        {pageHeadData}
        <ErrorAlert>
          <p>No events found for the chosen filter!</p>
        </ErrorAlert>
        <div className="center">
          <Button link="/events">Show All Events</Button>
        </div>
      </>
    );
  }

  const date = new Date(numYear, numMonth - 1);

  return (
    <>
      {pageHeadData}
      <ResultsTitle date={date} />
      <EventList items={filteredEvents} />
    </>
  );
}

// export async function getServerSideProps(context) {
//   const { params } = context;

//   const filterData = params.slug;

//   const filteredYear = filterData[0]; // ["2021", "5"] => "2021"
//   const filteredMonth = filterData[1]; // ["2021", "5"] => "5"

//   const numYear = +filteredYear; // 2021
//   const numMonth = +filteredMonth; // 5

//   if (
//     isNaN(numYear) ||
//     isNaN(numMonth) ||
//     numYear > 2030 ||
//     numYear < 2021 ||
//     numMonth < 1 ||
//     numMonth > 12 ||
//     error
//   ) {
//     return {
//       props: { hasError: true },
//       notFound: true,
//       // redirect: {
//       //   destination: '/error',
//       // },
//     };
//   }

//   const filteredEvents = await getFilteredEvents({
//     year: numYear,
//     month: numMonth,
//   });

//   return {
//     props: {
//       events: filteredEvents,
//       date: {
//         year: numYear,
//         month: numMonth,
//       },
//     },
//   };
// }

export default FilteredEventsPage;
