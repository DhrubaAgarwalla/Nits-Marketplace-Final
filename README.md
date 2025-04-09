# NIT Silchar Marketplace

A platform for NIT Silchar students to buy, sell, and rent items within the campus community.

## Features

- **Institute Email Authentication**: Only users with NIT Silchar email addresses (.nits.ac.in) can access the platform
- **Item Categories**: Lab equipment, books/notes, furniture, electronics, tickets, and miscellaneous
- **Listing Types**: Sell, buy, or rent items
- **Image Upload**: Add multiple images to your listings
- **WhatsApp Integration**: Direct contact with sellers via WhatsApp
- **Responsive Design**: Works on all devices

## Tech Stack

- **Frontend**: Next.js, Material UI
- **Backend**: Supabase (Authentication, Database, Storage)
- **Language**: TypeScript

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/nit-marketplace.git
   cd nit-marketplace
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a Supabase project:
   - Go to [Supabase](https://supabase.com/) and create a new project
   - Set up the database schema using the SQL in `supabase-schema.sql`
   - Enable Google OAuth in the Auth settings
   - Configure email provider for magic link authentication

4. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

5. Run the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
nit-marketplace/
├── public/             # Static assets
├── src/
│   ├── app/            # Next.js app router pages
│   ├── components/     # Reusable UI components
│   ├── context/        # React context providers
│   ├── services/       # API service functions
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── .env.local          # Environment variables (create this)
├── supabase-schema.sql # Database schema for Supabase
└── README.md           # Project documentation
```

## Authentication Flow

1. User signs in with their NIT Silchar email (.nits.ac.in)
2. They receive a magic link or use Google OAuth
3. After authentication, they can access all features of the marketplace

## Deployment

This project can be deployed on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add your environment variables
4. Deploy!

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- NIT Silchar for the inspiration
- Material UI for the beautiful components
- Supabase for the backend infrastructure
