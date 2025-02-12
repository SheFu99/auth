const convertMentionsToLinks = (text: string) => {
    // const mentionRegex = /@(\d+)(\w+\){1,\1})#/g;
    const mentionRegex = /@([\wа-яА-Я]+)/gu;
    const replaced =  text.replace(mentionRegex, (match, userLogin) => {
 
      return `<a href="/profile/${userLogin}" class="text-blue-600 hover:underline hover:text-blue-500">${match}</a>`;
    });
    return replaced
  };
//   return text.replace(/@([\w\s]+?)#(\w+?)@/g, (match, userName, userId) => {

export default convertMentionsToLinks