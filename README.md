Glove is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


## Deployment Guide to Kusama

Update the following `TEST_` constants to their `PROD_` equivalents for deployment to the Kusama network. This ensures proper connection to Kusama's services.

### 1. WebSocket URL
- **File:** `lib/providers/api.tsx`
- **Change:** Replace `TEST_WSS` with `PROD_WSS`.

### 2. Subscan API URL
- **File:** `lib/utils.ts`
- **Change:** Replace `TEST_SUBSCAN_NETWORK` with `PROD_SUBSCAN_NETWORK`.

### 3. SS58 Format
- **File:** `components/connect-wallet.tsx` and `components/wallet.tsx`
- **Change:** Replace `TEST_SS58_FORMAT` with `PROD_SS58_FORMAT`.

### 4. Token Symbol
- **File:** `components/voting-options.tsx`
- **Change:** Replace `TEST_TOKEN` with `PROD_TOKEN`.


## Components
The list of components below are the main components of the Glove voting system.

### ConfirmVote

**Location:** components/confirm-vote.tsx

**Description:**
This component handles the user interaction for confirming votes on referenda. It integrates with blockchain functionalities to submit votes using the user's selected account. The component manages its state for loading indicators, input errors, and interacts with several hooks to fetch and validate necessary data.

**Key Functionalities:**
- Validates user inputs for voting, including direction, amount, and conviction.
- Submits the vote to the Glove mixer and handles the response.
- Provides feedback to the user through snackbar messages.

### ReferendumList

**Location:** components/referendum-list.tsx

**Description:**
Displays a list of referenda that users can vote on. It allows filtering and sorting of referenda based on user interaction. The component fetches referenda data, processes it, and manages several pieces of state to control UI elements like filters and voting options.

**Key Functionalities:**
- Filters referenda based on voting status.
- Manages voting options and updates based on user selections.
- Interacts with the useDialog provider to handle modal dialogs for voting.

### VotingOptions

**Location:** components/voting-options.tsx

**Description:**
This component presents the user with interactive options for voting on a referendum. It allows users to adjust their vote amount, conviction level, and preferred direction. The component is designed to be reusable and is integrated within the ReferendumList to provide a consistent voting interface across different referenda.

**Key Functionalities:**
- Provides input fields for users to specify their vote amount and conviction.
- Allows users to select their voting direction (Aye or Nay).
- Validates user inputs and updates the parent component's state accordingly.

### VerifyVote

**Location:** components/verify-vote.tsx

**Description:**
This component allows users to verify the authenticity of their votes by comparing their PCR-0 output against the attestation bundle from the Glove enclave.

**Key Functionalities:**
- Allows users to input and submit their PCR-0 output for verification.
- Displays a success or error message based on the match result.
- Manages dialog visibility and input state dynamically.

### GloveProxy

**Location:** components/glove-proxy.tsx

**Description:**
Manages the assignment or removal of a user's GovProxy to the Glove Operator, facilitating participation in the Glove system.

**Key Functionalities:**
- Handles user interactions for joining or leaving the Glove system.
- Interacts with blockchain APIs to execute proxy assignments.
- Provides feedback and status updates through snackbar messages.


## Providers

### useDialog

**Location:** lib/providers/dialog

**Description:**
A custom hook that provides dialog management functionalities across the application. It allows components to open and close dialogs dynamically and manages the state related to the current referendum being voted on.

**Key Functionalities:**
- Manages open/close states of referendum voting dialogs.
- Stores and updates the currently selected referendum details.

### useAccounts

**Location:** lib/providers/account

**Description:**
Manages account-related state throughout the application. It handles the selection of user accounts, stores vote data, and interfaces with blockchain APIs to fetch account details and manage proxy settings.

**Key Functionalities:**
- Manages the selected user account and associated vote data.
- Provides functionalities to update vote data based on user actions.

### useApi

**Location:** lib/providers/api

**Description:**
Encapsulates interactions with the blockchain API, abstracting the complexity of direct blockchain interactions away from the UI components. It ensures that API calls are centralized and reusable across different components.

**Key Functionalities:**
- Provides a simplified interface for making API calls to the blockchain.
- Manages API state and reactivity to ensure components have the latest data.

### useSnackbar

**Location:** lib/providers/snackbar.tsx

**Description:**
This provider manages the display of snackbar messages across the application. It allows components to trigger informative or error messages based on user actions or system events, enhancing the user experience by providing timely feedback.

**Key Functionalities:**
- Displays messages in a non-blocking overlay that can be dismissed by the user.
- Supports different types of messages, including success, error, and information.
- Manages the queue of messages