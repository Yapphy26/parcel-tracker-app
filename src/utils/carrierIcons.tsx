export const carrierIcons = {
    "malaysia-post": { value: "malaysia-post", label: "Malaysia Post", img: "/images/couriers/poslaju.png" },
    "citylinkexpress": { value: "citylinkexpress", label: "City-Link Express", img: "/images/couriers/citylinkexpress.png" },
    "kangaroo-my": { value: "kangaroo-my", label: "Kangaroo Worldwide Express", img: "/images/couriers/kangaroo-my.png" },
    "nationwide-my": { value: "nationwide-my", label: "Nationwide Express", img: "/images/couriers/nationwide-my.png" },
    "gdex": { value: "gdex", label: "GDEX", img: "/images/couriers/gdex.png" },
    "skynet": { value: "skynet", label: "SkyNet Malaysia", img: "/images/couriers/skynet.png" },
    "abxexpress-my": { value: "abxexpress-my", label: "ABX Express", img: "/images/couriers/abxexpress-my.png" },
    "mypostonline": { value: "mypostonline", label: "Mypostonline", img: "/images/couriers/mypostonline.png" },
    "airpak-express": { value: "airpak-express", label: "Airpak Express", img: "/images/couriers/airpak-express.png" },
    "matdespatch": { value: "matdespatch", label: "Matdespatch", img: "/images/couriers/matdespatch.png" },
    "ninjavan-my": { value: "ninjavan-my", label: "Ninja Van Malaysia", img: "/images/couriers/ninjavan-my.png" },
    "poslaju": { value: "poslaju", label: "Pos Laju", img: "/images/couriers/poslaju.png" },
    "taqbin-my": { value: "taqbin-my", label: "TAQBIN Malaysia", img: "/images/couriers/taqbin-my.png" },
    "ddexpress": { value: "ddexpress", label: "DD Express", img: "/images/couriers/ddexpress.png" },
    "line-clear": { value: "line-clear", label: "Line Clear Express", img: "/images/couriers/line-clear.png" },
    "spx-my": { value: "spx-my", label: "Shopee Express Malaysia", img: "/images/couriers/spx-my.png" },
    "best-my": { value: "best-my", label: "BEST Express (Malaysia)", img: "/images/couriers/best-my.png" },
    "jtexpress-my": { value: "jtexpress-my", label: "J&T Express Malaysia", img: "/images/couriers/jtexpress-my.png" },
    "test-carrier": { value: "test-carrier", label: "Test Carrier", img: "/images/couriers/test-carrier.png" },
};

export type CarrierIcons = keyof typeof carrierIcons;

export function isCarrierIcons(value: string): value is CarrierIcons {
    return value in carrierIcons;
}