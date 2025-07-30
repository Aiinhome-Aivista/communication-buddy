const DEFAULT_ICON = "../../assets/person.svg";

export const formatMessage = (message) => {
  let formatted = message;

   // STEP 1: Remove "(yes/no)" or "yes/no" from end of sentence
  formatted = formatted.replace(/\(?yes\/no\)?/gi, "").trim();

  // STEP 2: Inject buttons if the message asks for satisfaction confirmation
  let shouldAppendButtons = /are you satisfied with this answer\?/i.test(formatted);
  // Dynamically replace company names with logos
  companies.forEach(({ companyName, logo }) => {
    const regex = new RegExp(`\\b(${companyName})\\b`, "gi");

    formatted = formatted.replace(regex, (match) => {
      return `
        <span class="company font-xs font-medium inline-flex items-center gap-1">
          ${match}
          <img 
            src="${logo}" 
            alt="${companyName} logo" 
            class="w-4 h-4 inline-block" 
            onerror="this.onerror=null;this.src='${DEFAULT_ICON}'"
          />
        </span>`;
    });
  });

  // Put numbered bullet points on separate lines with <div>
 formatted = formatted.replace(
  /(\d+\.\s.*?)(?=\s\d+\.|$)/gs,
  (match) =>
    `<br><div class="company px-2 py-1 mb-1 rounded-xl inline-block max-w-[90%]">${match.trim()}</div>`
);

if (shouldAppendButtons) {
    formatted += `
      <div class="flex gap-2 justify-end mt-1">
        <button class="username ai-img px-3 py-1 rounded-2xl text-xs cursor-pointer">Yes</button>
        <button class="border border-white no px-3 py-1 rounded-2xl text-xs cursor-pointer">No</button>
      </div>
    `;
  }


  return formatted;
};
