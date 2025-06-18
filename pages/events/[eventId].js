import { getEventById, getFeaturedEvents } from '../../helpers/api-util';

import EventSummary from '../../components/event-detail/event-summary';
import EventLogistics from '../../components/event-detail/event-logistics';
import EventContent from '../../components/event-detail/event-content';
import Head from 'next/head';

// This is the main page component for displaying details of a specific event
function EventDetailPage(props) {
  const event = props.selectedEvent;

  // If the event wasn't found (e.g., null or undefined), show an error message
  if (!event) {
    return (
      <div className="center">
        <p>Loading...</p>
      </div>
    );
  }

  // If the event exists, render all the relevant details using the components
  return (
    <>
      <Head>
        <title>{event.title}</title>
        <meta name="description" content={event.description} />
      </Head>
      {/* Displays the event title in a header */}
      <EventSummary title={event.title} />

      {/* Displays logistics info: date, location, and image */}
      <EventLogistics
        date={event.date}
        address={event.location}
        image={event.image}
        imageAlt={event.title}
      />

      {/* Displays the event description in the main content area */}
      <EventContent>
        <p>{event.description}</p>
      </EventContent>
    </>
  );
}

// Next.js function that runs at build time (Static Site Generation)
// It fetches the data for a single event based on the dynamic route parameter
export async function getStaticProps(context) {
  const eventId = context.params.eventId; // Extract the event ID from the URL

  const event = await getEventById(eventId); // Fetch the event details by ID

  if (!event) {
    return { notFound: true };
  }

  return {
    props: {
      selectedEvent: event, // Pass the fetched event as a prop to the page component
    },
    // Note: You could add `revalidate` here to enable Incremental Static Regeneration
    revalidate: 30,
  };
}

// Next.js function to pre-generate dynamic routes for each event page
// It tells Next.js which dynamic pages to build at build time
export async function getStaticPaths() {
  const events = await getFeaturedEvents(); // Fetch all events

  const paths = events.map((event) => ({
    params: { eventId: event.id }, // Create a path for each event using its ID
  }));
  // Result:
  // const paths = [
  //   { params: { eventId: 'e1' } },
  //   { params: { eventId: 'e2' } },
  //   { params: { eventId: 'e3' } },
  // ];

  return {
    // List of paths to pre-render
    paths,
    // Allows rendering of pages for paths not returned by getStaticPaths.
    // Next.js will serve a fallback version first, then load the full page
    // once it's generated. Useful for large or dynamic sets of paths.
    fallback: 'blocking',
  };
}

export default EventDetailPage;
