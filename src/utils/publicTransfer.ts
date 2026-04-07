import { TransactionOptions } from '@provablehq/aleo-types';
import { getFeeForFunction } from '@/utils/feeCalculator';

export const CREDITS_PROGRAM_ID = 'credits.aleo';
export const TRANSFER_PUBLIC_FUNCTION = 'transfer_public';

/**
 * Executes a public transfer of credits to a target address,
 * then updates the reward state via the API.
 *
 * @param wallet - The wallet adapter instance (can be LeoWalletAdapter or ShieldWalletAdapter).
 * @param publicKey - The public key of the user performing the transfer.
 * @param proposerAddress - The address to receive the public transfer.
 * @param bountyReward - The reward amount (in microcredits) to be transferred.
 * @param setTxStatus - Function to update the transaction status in the UI.
 * @param bountyId - The bounty ID.
 * @param proposalId - The proposal ID.
 * @returns The transaction ID of the submitted public transfer.
 */
export async function publicTransfer(
  wallet: any,
  publicKey: string,
  proposerAddress: string,
  bountyReward: number,
  setTxStatus: (status: string | null) => void,
  bountyId: number,
  proposalId: number,
): Promise<string> {
  // Format the reward amount (e.g. if bountyReward = 5000, then "5000000u64")
  const rewardAmountforTransfer = `${bountyReward}000000u64`;

  setTxStatus('Transferring reward to proposer (public transfer)...');

  // 1. Create the transaction input
  const transferInput = [proposerAddress, rewardAmountforTransfer];
  
  const fee = getFeeForFunction(TRANSFER_PUBLIC_FUNCTION);
  console.log('Calculated fee (in micro credits):', fee);

  const transaction: TransactionOptions = {
    program: CREDITS_PROGRAM_ID,
    function: TRANSFER_PUBLIC_FUNCTION,
    inputs: transferInput as string[],
    fee: fee,
  };

  const result = await wallet.executeTransaction(transaction);
  const txId = result.transactionId || result;
  
  setTxStatus(`Public transfer submitted: ${txId}`);

  // 2. Poll for finalization
  let finalized = false;
  for (let attempt = 0; attempt < 60; attempt++) {
    const statusResponse = await wallet.transactionStatus(txId);
    const status = String(statusResponse); 

    if (status === 'Finalized') {
      finalized = true;
      break;
    }
    await new Promise((res) => setTimeout(res, 2000));
  }

  if (!finalized) {
    throw new Error('Public transfer not finalized in time.');
  }

  setTxStatus('Public transfer finalized.');

  // 3. Call the API route to update the reward status
  const rewardResponse = await fetch('/api/update-proposal-reward', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      bountyId,
      proposalId,
      rewardSent: true,
    }),
  });

  if (!rewardResponse.ok) {
    throw new Error('Failed to update reward status.');
  }
  setTxStatus('Reward status updated.');
  
  return txId;
}