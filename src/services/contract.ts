import {
  Aptos,
  AptosConfig,
  Network,
  AccountAddress,
  InputViewFunctionData,
  ClientConfig
} from "@aptos-labs/ts-sdk";
import { CONTRACT_ADDRESS, MODULE_NAME, NETWORK, APTOS_API_KEY } from "@/utils/constants";
import { Message } from "@/types";

// Initialize Aptos client with the correct network configuration and API key
const network = Network.TESTNET; // Explicitly use TESTNET
console.log('Using network:', network);

// Check if API key is loaded
if (!APTOS_API_KEY) {
  console.error('API key is not set! Make sure .env.local is properly configured.');
}

// Add client config with API key
const clientConfig: ClientConfig = {
  API_KEY: APTOS_API_KEY
};

console.log('Using API key:', APTOS_API_KEY);
console.log('Client config:', JSON.stringify(clientConfig));

const aptosConfig = new AptosConfig({
  network,
  fullnode: NETWORK.fullnodeUrl,
  clientConfig // Add the client config with API key
});

console.log('Aptos config created with client config');

const aptos = new Aptos(aptosConfig);
console.log('Aptos client initialized');

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
    console.log('Creating transaction for sender:', sender);
    console.log('Message content:', content);
    
    // Let's try a completely different approach
    // Use the Aptos client to build the transaction payload
    const payload = {
      function: `${CONTRACT_ADDRESS}::${MODULE_NAME}::send_message`,
      type_arguments: [],
      arguments: [CONTRACT_ADDRESS, content]
    };
    
    console.log('Transaction payload:', payload);
    
    return payload;
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