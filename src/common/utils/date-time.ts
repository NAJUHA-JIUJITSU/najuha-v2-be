export class DateTime {
  private date: Date;

  constructor(date?: Date) {
    this.date = date ? new Date(date) : new Date();
  }

  // Convert to JS Date
  toJSDate(): Date {
    return new Date(this.date);
  }

  // Create a DateTime from a JS Date
  static fromJSDate(date: Date): DateTime {
    return new DateTime(date);
  }

  // Subtract days, hour, minute, and second
  minus({
    months = 0,
    days = 0,
    hour = 0,
    minute = 0,
    second = 0,
  }: { months?: number; days?: number; hour?: number; minute?: number; second?: number } = {}): DateTime {
    const result = new Date(this.date);
    result.setMonth(result.getMonth() - months);
    result.setDate(result.getDate() - days);
    result.setHours(result.getHours() - hour);
    result.setMinutes(result.getMinutes() - minute);
    result.setSeconds(result.getSeconds() - second);
    return new DateTime(result);
  }

  // Add days, hour, minute, and second
  plus({
    months = 0,
    days = 0,
    hour = 0,
    minute = 0,
    second = 0,
  }: { months?: number; days?: number; hour?: number; minute?: number; second?: number } = {}): DateTime {
    const result = new Date(this.date);
    result.setMonth(result.getMonth() + months);
    result.setDate(result.getDate() + days);
    result.setHours(result.getHours() + hour);
    result.setMinutes(result.getMinutes() + minute);
    result.setSeconds(result.getSeconds() + second);
    return new DateTime(result);
  }

  // Set specific hour, minute, and second
  set({ hour, minute, second }: { hour?: number; minute?: number; second?: number }): DateTime {
    const result = new Date(this.date);
    if (hour !== undefined) result.setHours(hour);
    if (minute !== undefined) result.setMinutes(minute);
    if (second !== undefined) result.setSeconds(second);
    return new DateTime(result);
  }

  // Format date (optional)
  toString(): string {
    return this.date.toISOString();
  }
}
