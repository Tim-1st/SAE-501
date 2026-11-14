import { describe, it, expect } from "vitest";
import { extractYoutubeId } from "./extract-youtube-id.js";
describe("extractYoutubeId", () => {
    it("should return the id when only an id is given", () => {
        expect(extractYoutubeId("dQw4w9WgXcQ")).toBe("dQw4w9WgXcQ");
    });
    it("should extract the id from a watch url", () => {
        const url = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
        expect(extractYoutubeId(url)).toBe("dQw4w9WgXcQ");
    });
    it("should extract the id from an embed url", () => {
        const url = "https://www.youtube.com/embed/dQw4w9WgXcQ";
        expect(extractYoutubeId(url)).toBe("dQw4w9WgXcQ");
    });
    it("should extract the id from an iframe", () => {
        const iframe = '<iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ"></iframe>';
        expect(extractYoutubeId(iframe)).toBe("dQw4w9WgXcQ");
    });
    it("should extract the id from a shorts url", () => {
        const url = "https://www.youtube.com/shorts/dQw4w9WgXcQ";
        expect(extractYoutubeId(url)).toBe("dQw4w9WgXcQ");
    });
    it("should return null for an invalid value", () => {
        expect(extractYoutubeId("pas une video")).toBeNull();
        expect(extractYoutubeId("")).toBeNull();
    });
});
