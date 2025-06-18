// Import core components from Next.js to customize the HTML document structure
import Document, { Html, Head, Main, NextScript } from 'next/document';

// Custom Document class to override and extend the default HTML structure
class MYDocument extends Document {
  render() {
    return (
      // The <Html> tag defines the root of the HTML document
      <Html lang="en">
        {/* <Head> is used to define metadata, links, and other head elements */}
        <Head />
        <body>
          {/* This <div> can be used as a portal target for modals, tooltips, etc. */}
          <div id="overlays" />

          {/* <Main> renders the main content of the page */}
          <Main />

          {/* <NextScript> injects Next.js scripts needed for the app to work */}
          <NextScript />
        </body>
      </Html>
    );
  }
}

// Export the custom Document to be used by Next.js
export default MYDocument;
