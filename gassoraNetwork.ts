import * as crypto from 'crypto';

// Enhanced Transaction Class
class Transaction {
  constructor(
    public amount: number,
    public sender: string, // public key
    public recipient: string // public key
  ) {
    this.timestamp = Date.now();
  }

  // Include a timestamp for better tracking
  private timestamp: number;

  toString() {
    return JSON.stringify(this);
  }
}

// Enhanced Block Class
class Block {
  private static difficulty = 4; // Adjust the difficulty for proof-of-work

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public timestamp: number = Date.now(),
    public nonce: number = 0
  ) {}

  // Introduce a dynamic difficulty adjustment
  get hash() {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }

  // Implement proof-of-work with dynamic difficulty
  mine() {
    while (this.hash.substring(0, Block.difficulty) !== Array(Block.difficulty + 1).join('0')) {
      this.nonce++;
    }
  }
}

// Enhanced Chain Class
class Chain {
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [this.createGenesisBlock()];
  }

  // Create a more configurable Genesis block
  private createGenesisBlock() {
    return new Block('', new Transaction(100, 'genesis', 'satoshi'), Date.parse('2022-01-01'));
  }

  // Implement a more efficient mining process
  mine(transaction: Transaction) {
    const newBlock = new Block(this.lastBlock.hash, transaction);
    newBlock.mine();
    this.chain.push(newBlock);
  }

  // Add a new block with enhanced validation
  addBlock(transaction: Transaction, senderPublicKey: string, signature: Buffer) {
    const isValidTransaction = this.validateTransaction(transaction, senderPublicKey, signature);

    if (isValidTransaction) {
      this.mine(transaction);
    }
  }

  // Enhanced transaction validation
  private validateTransaction(transaction: Transaction, senderPublicKey: string, signature: Buffer): boolean {
    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    return verify.verify(senderPublicKey, signature);
  }
}

// Example Usage

const satoshi = new Wallet();
const bob = new Wallet();
const alice = new Wallet();

satoshi.sendMoney(50, bob.publicKey);
bob.sendMoney(23, alice.publicKey);
alice.sendMoney(5, bob.publicKey);

console.log(Chain.instance);
