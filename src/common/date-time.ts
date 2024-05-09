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

  // Subtract days, hours, minutes, and seconds
  minus({
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: { months?: number; days?: number; hours?: number; minutes?: number; seconds?: number } = {}): DateTime {
    const result = new Date(this.date);
    result.setMonth(result.getMonth() - months);
    result.setDate(result.getDate() - days);
    result.setHours(result.getHours() - hours);
    result.setMinutes(result.getMinutes() - minutes);
    result.setSeconds(result.getSeconds() - seconds);
    return new DateTime(result);
  }

  // Add days, hours, minutes, and seconds
  plus({
    months = 0,
    days = 0,
    hours = 0,
    minutes = 0,
    seconds = 0,
  }: { months?: number; days?: number; hours?: number; minutes?: number; seconds?: number } = {}): DateTime {
    const result = new Date(this.date);
    result.setMonth(result.getMonth() + months);
    result.setDate(result.getDate() + days);
    result.setHours(result.getHours() + hours);
    result.setMinutes(result.getMinutes() + minutes);
    result.setSeconds(result.getSeconds() + seconds);
    return new DateTime(result);
  }

  // Set specific hours, minutes, and seconds
  set({ hours, minutes, seconds }: { hours?: number; minutes?: number; seconds?: number }): DateTime {
    const result = new Date(this.date);
    if (hours !== undefined) result.setHours(hours);
    if (minutes !== undefined) result.setMinutes(minutes);
    if (seconds !== undefined) result.setSeconds(seconds);
    return new DateTime(result);
  }

  // Format date (optional)
  toString(): string {
    return this.date.toISOString();
  }
}
