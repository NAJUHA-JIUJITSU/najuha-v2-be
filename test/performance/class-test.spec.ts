class Test {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  static create(name: string) {
    const newtest = new Test(name);
    newtest.name = 'bbbbbbbbb'; // 이부분에서 컴파일에러가 나지 않는 이유는?
    return newtest;
  }

  printName() {
    console.log(this.name);
  }
}

describe('class test', () => {
  it('class test', () => {
    const test1 = new Test('aaaaaa');
    test1.printName();
    const test2 = Test.create('aaaaaa');
    test2.printName();
  });
});
