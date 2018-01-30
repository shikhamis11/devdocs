/**
 * Copyright © Magento, Inc. All rights reserved.
 * See COPYING.txt for license details.
 */

import ko from "knockout";
import $t from "mage/translate";
import _ from "underscore";
import Config from "../config";
import Block from "./block";

export default class Banner extends Block {

    /**
     * Convert percent to decimal for transparent overlay for the preview
     *
     * @param {string} value
     * @returns {string}
     */
    private static convertPercentToDecimal(value: string) {
        return (parseInt(value, 10) / 100).toString();
    }

    /**
     * Retrieve the image URL with directive
     *
     * @param {Array} image
     * @returns {string}
     */
    private static getImageUrl(image: any[]) {
        const imageUrl = image[0].url;
        const mediaUrl = Config.getInitConfig("media_url");
        const mediaPath = imageUrl.split(mediaUrl);
        return "{{media url=" + mediaPath[1] + "}}";
    }

    /**
     * Get the banner wrapper attributes for the storefront
     *
     * @returns {any}
     */
    public getBannerAttributes(type: string) {
        const data = this.getData();
        let backgroundImage: string = "";
        if (type === "image") {
            backgroundImage = this.getImage() ? "url(" + this.getImage() + ")" : "none";
        } else if (type === "mobileImage") {
            backgroundImage = this.getMobileImage() ? "url(" + this.getMobileImage() + ")" : "none";
        }
        return {
            style:
            "background-image: " + backgroundImage + "; " +
            "min-height: " + data.minimum_height + "px; " +
            "background-size: " + data.background_size + ";",
        };
    }

    /**
     * Get the banner overlay attributes for the storefront
     *
     * @returns {any}
     */
    public getOverlayAttributes() {
        const data = this.getData();
        let bgColor: string = "transparent";
        const bgColorAttr: string = data.show_overlay !== "never_show" ? this.convertHexToRgba() : "transparent";

        if (data.show_overlay === "never_show" || data.show_overlay === "on_hover") {
            bgColor = "transparent";
        } else {
            bgColor = this.convertHexToRgba();
        }
        return {
            "data-background-color" : bgColorAttr,
            "style": "min-height: " + data.minimum_height + "px; background-color: " + bgColor + ";",
        };
    }

    /**
     * Get the banner content attributes for the storefront
     *
     * @returns {any}
     */
    public getContentAttributes() {
        const data = this.getData();
        const marginTop = data.fields.margins_and_padding.default.margin.top || "0";
        const marginRight = data.fields.margins_and_padding.default.margin.right || "0";
        const marginBottom = data.fields.margins_and_padding.default.margin.bottom || "0";
        const marginLeft = data.fields.margins_and_padding.default.margin.left || "0";
        const paddingTop = data.fields.margins_and_padding.default.padding.top || "0";
        const paddingRight = data.fields.margins_and_padding.default.padding.right || "0";
        const paddingBottom = data.fields.margins_and_padding.default.padding.bottom || "0";
        const paddingLeft = data.fields.margins_and_padding.default.padding.left || "0";
        return {
            style:
            "margin-top: " + marginTop + "px; " +
            "margin-right: " + marginRight + "px; " +
            "margin-bottom: " + marginBottom + "px; " +
            "margin-left: " + marginLeft + "px; " +
            "padding-top: " + paddingTop + "px; " +
            "padding-right: " + paddingRight + "px; " +
            "padding-bottom: " + paddingBottom + "px; " +
            "padding-left: " + paddingLeft + "px;",
        };
    }

    /**
     * Get the banner content for the storefront
     *
     * @returns {any}
     */
    public getContentHtml() {
        const data = this.getData();
        if (data.message === "" || data.message === undefined) {
            return;
        } else {
            return $t(data.message);
        }
    }

    /**
     * Get the desktop (main) image attributes for the render
     *
     * @returns {any}
     */
    public getImage() {
        const data = this.getData();
        if (data.image === "" || data.image === undefined) {
            return {};
        }
        if (_.isEmpty(data.image[0])) {
            return;
        }
        return Banner.getImageUrl(data.image);
    }

    /**
     * Get the mobile image attributes for the render
     *
     * @returns {any}
     */
    public getMobileImage() {
        const data = this.getData();
        if (data.mobile_image === "" || data.mobile_image === undefined) {
            return {};
        }
        if (_.isEmpty(data.mobile_image[0])) {
            return;
        }
        return Banner.getImageUrl(data.mobile_image);
    }

    /**
     * Convert HEX to RGBA for transparent overlay for the preview
     *
     * @returns {string}
     */
    private convertHexToRgba() {
        const data = this.getData();
        if (data.overlay_color !== "" && data.overlay_color !== undefined) {
            const colors = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(data.overlay_color);
            const red = parseInt(colors[1], 16);
            const green = parseInt(colors[2], 16);
            const blue = parseInt(colors[3], 16);
            const alpha = Banner.convertPercentToDecimal(data.overlay_transparency);
            return "rgba(" + red + "," + green + "," + blue + "," + alpha + ")";
        } else {
            return "transparent";
        }
    }
}
