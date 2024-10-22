import Color from 'chalk';

export class Output {
  private currentTab = 0;
  constructor(private output: string[] = []) {}

  public add(lines: string | string[]) {
    if (Array.isArray(lines)) {
      lines.forEach(line => this.add(line));
      return this;
    }

    this.output.push(lines);

    return this;
  }

  public category(cat: string) {
    const ucCat = cat[0].toUpperCase() + cat.slice(1);

    return this.add(Color.bold.underline(ucCat));
  }

  public newLine(count = 1) {
    for (let i = 0; i < count; i++) {
      this.add('');
    }

    return this;
  }

  public render() {
    return this.output.join('\n');
  }

  public pushTab() {
    this.currentTab++;
  }

  public pullTab() {
    this.currentTab--;
  }

  public addition(text: string) {
    return Color.green(`+ ${text}`);
  }

  public substration(text: string) {
    return Color.red(`- ${text}`);
  }

  public tab(text: string) {
    return ' '.repeat(this.currentTab * 2) + text;
  }

  public warn(message: string) {
    return this.add(`[${this.yellow('WARN')}] ${message}`);
  }

  public yellow(text: string) {
    return Color.yellow(text);
  }
}
