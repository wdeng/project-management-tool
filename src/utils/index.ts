export function camelToTitle(camelStr: string) {
  return camelStr
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')  // Add a space before each uppercase letter that follows a lowercase letter or number
    .split(' ')  // Split the string by space
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))  // Capitalize the first letter of each word
    .join(' ');  // Join the words back into a single string
}
