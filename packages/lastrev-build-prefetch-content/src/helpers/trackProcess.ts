import ora from 'ora';

class ProcessTracker {
  name: string;
  spinner: ora.Ora;
  startTime: number;

  constructor(name) {
    this.name = name;
    this.spinner = ora(name).start();
    this.startTime = Date.now();
  }

  stop() {
    this.spinner.stop();
    console.log(`Finished: ${this.name}. Time: ${(Date.now() - this.startTime) / 1000}s`);
    return this;
  }
}

const trackProcess = (name) => {
  return new ProcessTracker(name);
};

export default trackProcess;
