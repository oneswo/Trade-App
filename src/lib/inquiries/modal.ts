export const OPEN_INQUIRY_MODAL_EVENT = "open-inquiry-modal";

export function openInquiryModal() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(OPEN_INQUIRY_MODAL_EVENT));
}
