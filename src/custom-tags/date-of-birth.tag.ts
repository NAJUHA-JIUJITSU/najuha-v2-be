import { TagBase } from 'typia/lib/tags';

export type BirthDate = TagBase<{
  target: 'string'; // The target type is string since the Date of Birth is represented in a string format.
  kind: 'BirthDate'; // A unique identifier for this custom tag, renamed as requested.
  value: undefined; // No specific value is needed for this validation.
  validate: `(() => {
    const year = Number($input.slice(0, 4));
    const month = Number($input.slice(4, 6)) - 1;
    const day = Number($input.slice(6, 8));
    const date = new Date(year, month, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month &&
      date.getDate() === day
    );
  })()`;
  exclusive: true; // This tag should not be combined with other date validation tags.
}>;
