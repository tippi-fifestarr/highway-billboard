import { 
  Aptos, 
  AptosConfig, 
  Network, 
  AccountAddress,
  InputViewFunctionData
} from "@aptos-labs/ts-sdk";
import { CONTRACT_ADDRESS, MODULE_NAME, NETWORK } from "@/utils/constants";
import { Message } from "@/types";

// Initialize Aptos client with the correct network configuration
const network = NETWORK.name === 'devnet' ? Network.DEVNET : Network.TESTNET;
const aptosConfig = new AptosConfig({
  network,
  fullnode: NETWORK.fullnodeUrl,
});

const aptos = new Aptos(aptosConfig);

// Type for the message from the contract
interface ContractMessageResponse {
  content: string;
  author: string;
  timestamp: string;
}

/**
 * Get all messages from the billboard
 * @returns Array of messages
 */
export async function getAllMessages(): Promise<Message[]> {
  try {
    const viewFunction: InputViewFunctionData = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_all_messages`,
      typeArguments: [],
      functionArguments: [CONTRACT_ADDRESS],
    };

    const result = await aptos.view({ payload: viewFunction });
    
    if (!result || !result[0] || !Array.isArray(result[0])) {
      return [];
    }
    
    // Transform the result into our Message type
    // The contract returns an array of messages with content, author, and timestamp
    return (result[0] as ContractMessageResponse[]).map((msg) => ({
      content: msg.content,
      author: msg.author,
      timestamp: Number(msg.timestamp),
    }));
  } catch (error) {
    console.error('Error getting messages:', error);
    throw error;
  }
}

/**
 * Get the number of messages on the billboard
 * @returns Number of messages
 */
export async function getMessageCount(): Promise<number> {
  try {
    const viewFunction: InputViewFunctionData = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_message_count`,
      typeArguments: [],
      functionArguments: [CONTRACT_ADDRESS],
    };

    const result = await aptos.view({ payload: viewFunction });
    
    if (!result || !result[0]) {
      return 0;
    }
    
    return Number(result[0]);
  } catch (error) {
    console.error('Error getting message count:', error);
    throw error;
  }
}

/**
 * Get a specific message by index
 * @param index Message index
 * @returns Message
 */
export async function getMessageAtIndex(index: number): Promise<Message | null> {
  try {
    const viewFunction: InputViewFunctionData = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::get_message_at_index`,
      typeArguments: [],
      functionArguments: [CONTRACT_ADDRESS, index.toString()],
    };

    const result = await aptos.view({ payload: viewFunction });
    
    if (!result || !result[0]) {
      return null;
    }
    
    const msg = result[0] as ContractMessageResponse;
    
    return {
      content: msg.content,
      author: msg.author,
      timestamp: Number(msg.timestamp),
    };
  } catch (error) {
    console.error(`Error getting message at index ${index}:`, error);
    throw error;
  }
}

/**
 * Send a message to the billboard
 * @param sender Sender's account address
 * @param content Message content
 * @returns Transaction payload
 */
export async function sendMessage(sender: string, content: string) {
  try {
    // Verify that we're using the correct network
    if (network !== Network.DEVNET) {
      console.warn('Warning: Contract is deployed on Devnet, but current network is not Devnet');
      throw new Error('Network mismatch: Please switch your wallet to Devnet to interact with this contract');
    }
    
    const transaction = {
      sender,
      data: {
        function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_message`,
        typeArguments: [],
        functionArguments: [CONTRACT_ADDRESS, content],
      },
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating send message transaction:', error);
    throw error;
  }
}

/**
 * Get account APT balance
 * @param accountAddress Account address
 * @returns APT balance as a number
 */
export async function getAccountAPTBalance(accountAddress: string | object | unknown): Promise<number> {
  try {
    // Ensure accountAddress is a string before using fromString
    if (typeof accountAddress !== 'string') {
      console.error('Invalid address format:', accountAddress);
      return 0;
    }
    
    // Convert string to AccountAddress
    const address = AccountAddress.fromString(accountAddress);
    
    const balance = await aptos.getAccountAPTAmount({
      accountAddress: address,
    });
    
    return Number(balance);
  } catch (error) {
    console.error('Error getting account balance:', error);
    return 0; // Return 0 instead of throwing to prevent UI errors
  }
}