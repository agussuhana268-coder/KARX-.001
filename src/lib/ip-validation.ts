export type IPVersion = "ipv4" | "ipv6";

export interface IPValidationResult {
  isValid: boolean;
  version: IPVersion | null;
  cleaned: string;
  error?: string;
}

/**
 * Local IP validation utility for KARX/.001.
 * Supports IPv4 and IPv6 according to standard network specifications.
 * Trims leading/trailing whitespace before validation.
 * No external dependencies.
 */
export function validateIP(input: string): IPValidationResult {
  const cleaned = (input || "").trim();

  if (!cleaned) {
    return {
      isValid: false,
      version: null,
      cleaned: "",
      error: "Target IP address required. Enter an IPv4 or IPv6 address.",
    };
  }

  // IPv4 validation: exactly 4 octets separated by '.', each 0-255, no leading zeros unless single '0'
  const ipv4Octets = cleaned.split(".");
  if (ipv4Octets.length === 4) {
    const allValid = ipv4Octets.every((octet) => {
      if (!/^\d+$/.test(octet)) return false;
      if (octet.length > 1 && octet.startsWith("0")) return false;
      const num = Number(octet);
      return num >= 0 && num <= 255;
    });

    if (allValid) {
      return {
        isValid: true,
        version: "ipv4",
        cleaned,
      };
    }
  }

  // IPv6 validation:
  // Must contain ':' and follow RFC 4291 compressed or full format
  if (cleaned.includes(":")) {
    const doubleColonCount = (cleaned.match(/::/g) || []).length;
    if (doubleColonCount <= 1) {
      const startsWithSingleColon = cleaned.startsWith(":") && !cleaned.startsWith("::");
      const endsWithSingleColon = cleaned.endsWith(":") && !cleaned.endsWith("::");

      if (!startsWithSingleColon && !endsWithSingleColon) {
        const ipv6Regex =
          /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;

        if (ipv6Regex.test(cleaned)) {
          return {
            isValid: true,
            version: "ipv6",
            cleaned,
          };
        }
      }
    }
  }

  return {
    isValid: false,
    version: null,
    cleaned,
    error: "Invalid IP address format. Enter a valid IPv4 or IPv6 target.",
  };
}
