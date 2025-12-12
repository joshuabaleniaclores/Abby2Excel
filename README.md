# Abby2Excel - Image to Excel Converter

Abby2Excel is a powerful "Image to Excel" web application built with Next.js 16 and Google's Gemini Flash 2.5 AI model. It allows users to upload images of delivery receipts or invoices, automatically extracts structured data (items, quantities, dates, etc.), and exports it into a formatted Excel spreadsheet.

## Features

-   **AI-Powered Extraction**: Uses Google's Gemini 2.5 Flash model to intelligently parse unstructured data from images.
-   **Drag & Drop Upload**: Seamless file upload interface with preview and validation.
-   **Editable Data**: Review and correct extracted data in an intuitive table interface before exporting.
-   **Excel Export**: Download structured data as an `.xlsx` file, formatted specifically for Manila Delivery reports.
-   **Modern Tech Stack**: Built with the latest web technologies for speed and reliability.
-   **Secure**: API keys are handled server-side, ensuring your credentials are never exposed to the client.

##  Tech Stack

-   **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **AI Model**: [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/flash/)
-   **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Excel Generation**: [SheetJS (xlsx)](https://sheetjs.com/)
-   **File Handling**: [React Dropzone](https://react-dropzone.js.org/)

##  Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites

-   Node.js 18+ installed
-   A Google AI Studio API Key (for Gemini)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/joshuabaleniaclores/Abby2Excel.git
    cd Abby2Excel
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Environment Setup**
    Create a `.env.local` file in the root directory and add your Google API Key:

    ```env
    GOOGLE_API_KEY=your_google_api_key_here
    ```
    > **Note**: You can get an API key from [Google AI Studio](https://aistudio.google.com/).

4.  **Run the development server**
    ```bash
    npm run dev
    ```

5.  **Open the app**
    Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 📖 Usage

1.  **Upload**: Drag and drop an image of a delivery receipt (JPG, PNG, WEBP) into the upload area.
2.  **Extract**: Click the "Extract Operations" button. The AI will analyze the image.
3.  **Review**: Check the extracted data in the table below. You can edit any field (Qty, Unit, Item, etc.) if the AI made a mistake.
4.  **Download**: Click "Download Excel" to save the report to your computer.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1.  Fork the project
2.  Create your feature branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
