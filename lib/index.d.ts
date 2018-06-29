interface IRoute {}

interface IQuestion {}

interface IButton {
  label: string;
  color: "negative" | "positive" | "primary" | "default";
}

export declare class IKeyboard {
  constructor(
    keyboard: Array<IButton>,
    options: {
      one_time: boolean;
      layout?: Array<Number> | number;
    }
  );
}

interface IContext {
  sendMessage(message: string, ...data): Promise<any>;
  sendKeyboard(keyboard: IKeyboard, message: string);
  use();
  ask();
}

interface IBaseQueue {}

export declare class Next {
  constructor(token: string, queue: IBaseQueue, options: { isGroup: boolean });
  startPooling();
  startBotPooling(groupId: number);
  on(event: string, callback: (ctx: IContext) => any);
}

export class Keyboard extends IKeyboard {}
