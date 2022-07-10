export const wordWrapText = (
  text: string,
  length: number,
  spill: number,
): string[] => {
  const wrapArray: string[] = []; // clear existing array
  const wordArray = text.trim().split(' ');
  const idealLength =
    length && length.constructor === Number && length > 0
      ? length
      : text.length / 5;
  spill = spill && spill.constructor === Number && spill > 0 ? spill : 0;
  const spillLength = idealLength + spill;
  let nextWord: string,
    nextWordLen: number,
    valueLen: number,
    newLength: number,
    maxWordLength: number,
    overflow: boolean,
    eof: boolean,
    tmp: string | null,
    diff: number | null,
    getNextWord: boolean,
    candidate: string;

  const wordLoop = (value?: string, i?: number): string[] => {
    /* returns an array of trimmed lines */
    i = i || 0;
    tmp = diff = null;
    value = value || wordArray[i] || '';
    valueLen = value.length;
    nextWord = wordArray[i + 1] || '';
    nextWordLen = nextWord.length || 0;
    newLength = valueLen + nextWordLen;
    overflow = newLength >= idealLength && newLength >= spillLength;
    maxWordLength = Math.max(idealLength, spillLength);
    eof = !wordArray[i + 1];
    getNextWord = !eof && !overflow;
    candidate = value + ' ' + nextWord;

    if (getNextWord) {
      return wordLoop(candidate, i + 1);
    }
    /*
      	Exception catcher:
      	ensure the next word length is shorter than max length
      */
    if (nextWordLen >= maxWordLength) {
      tmp = candidate.slice(0, maxWordLength);
      diff = candidate.length - tmp.length;
      wordArray[i + 1] = nextWord.slice(-diff);
      value = tmp;
    }
    /*
      	Exception catcher:
      	truncate extremely long strings, update word array,
      	and recurse the remainder
      */
    if (value.length > maxWordLength) {
      tmp = value.slice(0, maxWordLength);
      diff = value.length - tmp.length;
      wrapArray.push(tmp);
      value = value.slice(-diff);
      return wordLoop(value, i);
    }
    if (value) {
      // Here is where you can do something with each row of text
      wrapArray.push(value.trim());
      return wordLoop('', i + 1);
    }
    return wrapArray;
  };

  return wordLoop();
};
