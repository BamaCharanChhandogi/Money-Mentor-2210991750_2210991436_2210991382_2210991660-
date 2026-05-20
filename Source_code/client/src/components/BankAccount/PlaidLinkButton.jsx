import { usePlaidLink } from "react-plaid-link";

const PlaidLinkButton = ({ onSuccess, onExit }) => {
    const { open, ready } = usePlaidLink({
      onSuccess,
      onExit,
      token: async () => {
        const linkToken = await plaidApi.createLinkToken();
        return linkToken;
      },
    });
  
    return (
      <button
        onClick={() => open()}
        disabled={!ready}
        className="p-2 bg-blue-500 text-white rounded"
      >
        Connect Bank Account
      </button>
    );
  };
export default PlaidLinkButton;  