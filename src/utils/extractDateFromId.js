export function extractDateFromId(id) {
    const matches = id.match(/\d{4}-\d{2}-\d{2}T\d{2}-\d{2}-\d{2}Z/g);
    if (matches && matches.length > 0) {
        const dateString = matches[0].replace(/(\d{4})-(\d{2})-(\d{2})T(\d{2})-(\d{2})-(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z');
        const date = new Date(dateString);
        
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        const month = months[date.getUTCMonth()];
        const day = date.getUTCDate();
        const year = date.getUTCFullYear();
        
        const hours = date.getUTCHours().toString().padStart(2, '0');
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const seconds = date.getUTCSeconds().toString().padStart(2, '0');
        const time = `${hours}:${minutes}:${seconds} UTC`;

        return `${month} ${day}, ${year} at ${time}`;
    }
    return "Invalid date";
}