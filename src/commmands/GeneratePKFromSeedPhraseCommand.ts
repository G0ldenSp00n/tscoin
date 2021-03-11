export default class GeneratePKFromSeedPhraseCommand {
  constructor() {
  }

  async prepare(): Promise<void> {
  }

  static run() {
  }

  async persist(): Promise<void> {
  }

  async execute() {
    await this.prepare();
    GeneratePKFromSeedPhraseCommand.run();
    await this.persist();
  }
}
