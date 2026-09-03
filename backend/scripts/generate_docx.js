const fs = require("fs");
const path = require("path");
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
} = require("docx");

async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          new Paragraph({
            text: "Comprehensive Case Study: Multi-Vendor MERN E-Commerce Architecture",
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Fellowship Task Submission: ", bold: true }),
              new TextRun("DevWeekends Web Development Fellowship\n"),
              new TextRun({ text: "Project: ", bold: true }),
              new TextRun("Flagship Multi-Vendor E-Commerce Platform (Becodemy Series)\n"),
              new TextRun({ text: "Author: ", bold: true }),
              new TextRun("Imran Tahir\n"),
              new TextRun({ text: "Stack: ", bold: true }),
              new TextRun("React 18, Redux Toolkit, Node.js 24, Express 4.19, MongoDB (Mongoose 8.3), Socket.io, Stripe, Tailwind CSS\n"),
              new TextRun({ text: "GitHub Repository: ", bold: true }),
              new TextRun("https://github.com/ImranTahir673/multi-vendor-ecommerce\n"),
            ],
            spacing: { after: 300 },
          }),

          new Paragraph({
            text: "1. Executive Summary",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "This case study documents the design, architecture, implementation, and engineering modernizations executed for the Multi-Vendor MERN E-Commerce Platform. The platform supports a decentralized marketplace model consisting of three distinct participant roles: Buyers/Customers, Independent Vendors/Sellers, and Platform Administrators.",
            spacing: { after: 150 },
          }),
          new Paragraph({
            text: "• Buyers: Browse catalog, real-time live search, category filtering, cart & wishlist management, vendor coupon discounts, multi-vendor checkout (Stripe & Cash on Delivery), order shipment tracking, ratings/reviews, and real-time live chat with shop owners.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "• Sellers: Public shop storefront, multi-image product catalog management, time-delimited promotional flash sales with live countdowns, custom coupon codes, step-by-step order fulfillment pipeline ('Processing' to 'Delivered'), refunds, net balance calculation (10% platform fee deducted), and bank payout withdrawals.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "• Administrators: System health supervision, cumulative marketplace commission tracking, moderation of registered users and sellers, transaction audits, and withdrawal approval workflows.",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "2. System Architecture & Component Breakdown",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "The platform follows a distributed decoupled architecture designed for high scalability, low client latency, and independent microservice deployment:",
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: "1. Frontend Client (/frontend): Single Page Application built on React 18 and React Router DOM 6. State management is structured into discrete Redux Toolkit slices (user, seller, products, events, cart, wishlist, order). Styled with Tailwind CSS and modern responsive design.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "2. Backend REST Engine (/backend): Built with Express 4.19 and Node.js. Handles business logic, dual cookie-based JWT authentication, multi-vendor order partitioning, transaction auditing, and cloud asset pipeline integration.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "3. Standalone Real-Time Socket Microservice (/socket): Standalone Socket.io 4.7 service on port 4000 managing persistent duplex WebSocket connections for real-time buyer-to-seller chat and instant delivery indicators.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "4. Cloud Infrastructure: MongoDB Atlas (document persistence via Mongoose 8.3), Stripe API (payment intents and card tokenization), Cloudinary (optimized cloud media hosting), and Nodemailer (transactional emails).",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "3. Database Schema & Data Models",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "The persistence layer defines 9 interdependent Mongoose schemas:",
            spacing: { after: 120 },
          }),
          new Paragraph({
            text: "• User: Buyer identity, hashed passwords (bcrypt), address book array, roles ('user', 'Admin'), avatar metadata.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Shop: Independent vendor identity, public description, address, bank withdrawal details, available balance, transaction history.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Product: Marketplace inventory, price, discountPrice, stock, category, tags, images array, reviews & ratings, shop association.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Event: Promotional flash sale campaign with start_Date, Finish_Date, and countdown tracking.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• CoupounCode: Shop-specific percentage discount vouchers with minimum/maximum purchase amount constraints.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Order: Vendor-partitioned order document storing item snapshots, shipping address, status pipeline, payment status, and delivery timestamps.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Conversation & Messages: Real-time chat threads indexed by member IDs and discrete text/image communication records.",
            spacing: { after: 60 },
          }),
          new Paragraph({
            text: "• Withdraw: Vendor fund payout requests with status transitions ('Processing' to 'Succeed').",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "4. Multi-Vendor Order Splitting Engine",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "In a multi-vendor marketplace, a customer can checkout with products from multiple distinct sellers in a single transaction. The order creation engine partitions cart items by vendor shopId into discrete Order documents in MongoDB. This ensures that each seller receives and fulfills only their own items, delivery statuses progress independently, and ratings/reviews attach directly to the respective store.",
            spacing: { after: 150 },
          }),

          new Paragraph({
            text: "5. Platform Commission & Automated Seller Balance",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "When a vendor advances an order to 'Delivered': (1) The system checks previous delivery status to prevent double-crediting. (2) Product stock is atomically decremented in MongoDB and sold_out count incremented. (3) A 10% platform commission is retained by the marketplace. (4) The remaining 90% is atomically credited to the seller's availableBalance for bank payout withdrawal.",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "6. Security & Dual JWT Cookie Authentication",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "The application enforces dual cookie-based JWT tokens ('token' for buyers and 'seller_token' for vendors) configured with httpOnly: true, sameSite: 'none', and secure: true. This allows a user to maintain simultaneous active buyer and seller sessions without session collisions and provides seamless cross-domain operation between Vercel and Render.",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "7. Engineering Challenges & Modernizations",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({
            text: "• Mongoose 8 Compatibility: The reference repository utilized product.remove() and event.remove(), which were completely removed in Mongoose 8. All deletion handlers were modernized to findByIdAndDelete().",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "• Event Controller Bugfix: Fixed a bug in the reference repository where the delete event route queried product instead of event.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "• Cloudinary & SMTP Fallbacks: Wrapped third-party cloud uploads in try/catch fallbacks with default avatar URLs, ensuring registrations never crash if API keys are unconfigured in development.",
            spacing: { after: 80 },
          }),
          new Paragraph({
            text: "• React 18 & Redux Toolkit: Replaced deprecated React boilerplate and legacy Redux string actions with Redux Toolkit slices and modern React 18 hooks.",
            spacing: { after: 200 },
          }),

          new Paragraph({
            text: "8. Fellowship Submission Checklist",
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 200, after: 120 },
          }),
          new Paragraph({ text: "✔ Multi-vendor marketplace architecture completed.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Multi-vendor order splitting per shopId verified.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Product & promotional event catalog with live countdown clocks.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Shop coupon code discount engine with cart threshold logic.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Real-time duplex buyer-to-seller chat via Socket.io.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Cash on Delivery (COD) and Stripe card payment workflows.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Multi-role authentication (Buyer, Seller, Admin).", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Backend successfully deployed and live on Render.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ Frontend client production bundle compiled and ready on Vercel.", spacing: { after: 60 } }),
          new Paragraph({ text: "✔ GitHub repository synchronized and case study completed.", spacing: { after: 120 } }),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, "../../CASE_STUDY.docx");
  fs.writeFileSync(outputPath, buffer);
  console.log(`CASE_STUDY.docx successfully generated at: ${outputPath}`);
}

generateDocx().catch((err) => console.error(err));
