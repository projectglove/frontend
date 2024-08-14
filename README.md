Glove is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Abstract / Introduction

This project is a comprehensive voting system designed for blockchain-based governance, specifically tailored for managing referenda in a decentralized environment. The system leverages the Polkadot.js extension for secure interactions with the Polkadot network, allowing users to vote on various proposals directly from their browsers. The application is structured around a series of React components and context providers that manage state and interactions with blockchain networks, ensuring a seamless user experience while maintaining high security and data integrity standards.


## Components
ConfirmVote
Location: components/confirm-vote.tsx
Description:
This component handles the user interaction for confirming votes on referenda. It integrates with blockchain functionalities to submit votes using the user's selected account. The component manages its state for loading indicators, input errors, and interacts with several hooks to fetch and validate necessary data.
Key Functionalities:
Validates user inputs for voting, including direction, amount, and conviction.
Submits the vote to the blockchain and handles the response.
Provides feedback to the user through snackbar messages.

ReferendumList
Location: components/referendum-list.tsx
Description:
Displays a list of referenda that users can vote on. It allows filtering and sorting of referenda based on user interaction. The component fetches referenda data, processes it, and manages several pieces of state to control UI elements like filters and voting options.
Key Functionalities:
Filters referenda based on voting status.
Manages voting options and updates based on user selections.
Interacts with the useDialog provider to handle modal dialogs for voting.

VotingOptions
Location: components/voting-options.tsx
Description:
This component presents the user with interactive options for voting on a referendum. It allows users to adjust their vote amount, conviction level, and preferred direction. The component is designed to be reusable and is integrated within the ReferendumList to provide a consistent voting interface across different referenda.
Key Functionalities:
Provides input fields for users to specify their vote amount and conviction.
Allows users to select their voting direction (Aye or Nay).
Validates user inputs and updates the parent component's state accordingly.


Providers
useDialog
Location: lib/providers/dialog
Description:
A custom hook that provides dialog management functionalities across the application. It allows components to open and close dialogs dynamically and manages the state related to the current referendum being voted on.
Key Functionalities:
Manages open/close states of referendum voting dialogs.
Stores and updates the currently selected referendum details.
useAccounts
Location: lib/providers/account
Description:
Manages account-related state throughout the application. It handles the selection of user accounts, stores vote data, and interfaces with blockchain APIs to fetch account details and manage proxy settings.
Key Functionalities:
Manages the selected user account and associated vote data.
Provides functionalities to update vote data based on user actions.
useApi
Location: lib/providers/api
Description:
Encapsulates interactions with the blockchain API, abstracting the complexity of direct blockchain interactions away from the UI components. It ensures that API calls are centralized and reusable across different components.
Key Functionalities:
Provides a simplified interface for making API calls to the blockchain.
Manages API state and reactivity to ensure components have the latest data.
useSnackbar
Location: lib/providers/snackbar.tsx
Description:
This provider manages the display of snackbar messages across the application. It allows components to trigger informative or error messages based on user actions or system events, enhancing the user experience by providing timely feedback.
Key Functionalities:
Displays messages in a non-blocking overlay that can be dismissed by the user.
Supports different types of messages, including success, error, and information.
Manages the queue of messages and handles their timing and display logic.

Conclusion
This documentation provides a detailed overview of the key components and providers within the voting system project. Each component and provider is designed to fulfill specific roles within the application, ensuring modularity, reusability, and maintainability. The integration with blockchain technologies through the Polkadot.js extension and the use of React for the frontend framework makes this project a robust solution for decentralized governance voting systems.