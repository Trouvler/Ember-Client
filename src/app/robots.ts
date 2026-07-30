import type { MetadataRoute } from "next";

// 상황실 관제사용 화면은 검색에 노출되면 안 된다.
// 대국민 공개 화면과 소개 페이지만 크롤링을 허용한다.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/dashboard/policy"],
      disallow: ["/analysis", "/analysis/", "/dashboard"],
    },
  };
}
