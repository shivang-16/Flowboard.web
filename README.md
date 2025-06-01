# Flowboard

Visualize, organize, and own your workflow with clarity.

## Project Description

Flowboard is a comprehensive task management application designed to help users visualize, organize, and track their projects and tasks efficiently. It provides features for creating projects, managing tasks within different columns (e.g., To Do, In Progress, Completed), assigning tasks to users, setting priorities and due dates, and viewing project analytics.

## Features

- **Project Management**: Create, edit, and delete projects.
- **Task Tracking**: Add, update, and delete tasks within project boards.
- **Drag-and-Drop Interface**: Easily move tasks between different status columns.
- **User Assignment**: Assign tasks to specific project members.
- **Priority and Due Dates**: Set priority levels (high, medium, low) and due dates for tasks.
- **User Authentication**: Secure login and signup functionality.
- **Google Login**: Convenient authentication via Google.
- **Project Analytics**: View task distribution (To Do, In Progress, Completed) for each project.
- **User Avatars**: Display user avatars with initial letters and consistent color coding.
- **Responsive Design**: Optimized for various screen sizes.

## Installation

To set up the project locally, follow these steps:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/shivang-16/flowboard.web
    cd flowboard.web
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or yarn install
    ```

3.  **Configure Environment Variables**:
    Create a `.env.local` file in the root directory and add your environment variables. An example is provided in `.env.example`.
    ```
    NEXT_PUBLIC_API_BASE_URL=http://localhost:5000 # Replace with your backend API URL
    ```

4.  **Run the development server**:
    ```bash
    npm run dev
    # or yarn dev
    ```

    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

-   **Login/Signup**: Create an account or log in using your credentials or Google.
-   **Dashboard**: View all your projects. Click on a project card to navigate to its board.
-   **Project Board**: Manage tasks by dragging them between columns. Create new tasks, edit existing ones, and assign them to team members.
-   **Filtering**: Filter tasks by priority or assigned user.
-   **Invite Members**: Add new members to your project.

## Technologies Used

-   **Next.js**: React framework for production.
-   **React**: Frontend JavaScript library.
-   **TypeScript**: Strongly typed JavaScript.
-   **Tailwind CSS**: Utility-first CSS framework for styling.
-   **Recharts**: Composable charting library for React.
-   **Lucide React**: Icon library.
-   **React Hot Toast**: For notifications.
-   **Axios**: Promise-based HTTP client.
-   **Redux Toolkit**: For state management.
-   **NextAuth.js**: For authentication (inferred from `(auth)` directory).

## Contributing

Contributions are welcome! Please fork the repository and create a pull request with your changes.

## License

This project is licensed under the MIT License - see the <mcfile name="LICENSE" path="LICENSE"></mcfile> file for details.