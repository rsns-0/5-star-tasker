import { injectable } from 'tsyringe';

class TestService {
	public printMessage() {
		console.log('hello world');
	}

	public returnText() {
		return 'hello world';
	}
}

@injectable()
export class TestController {
	constructor(private testService: TestService) {}

	public returnTextOfService() {
		return this.testService.returnText();
	}
}
