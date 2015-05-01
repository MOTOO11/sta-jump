/// <reference path="../../../typings/jasmine/jasmine.d.ts"/>
/// <reference path="../ts/build.ts"/>
describe('test runnner',() => {
  var main : Main ;
  beforeEach(() => {
    main = new Main();
  });
  
  it("main text", () => {
    expect(main.text).toBe("main");
  });

  it("main test", () => {
    expect(main.say()).toBe("main");
  });
  
  it("main text change.", () => {
    expect(main.setText('change')).toBe("change");
  });  
  
  it("sub in main text change.", () => {
    expect(main.sub()).toBe("hello sub.");
  });
    
  it("test.", () => {
    expect('test').toBe("test");
  });
});