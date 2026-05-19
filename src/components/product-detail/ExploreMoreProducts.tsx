import React from 'react';
import { Link } from 'react-router-dom';
import { toSlug } from '../../lib/utils';

interface ProductLink {
  text: string;
  categorySlug: string;
  subcategorySlug?: string;
}

const MECSU_PRODUCT_LINKS: ProductLink[] = [
  { text: "Bulong lục giác chìm đầu trụ DIN 912", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "bulong-luc-giac-chim" },
  { text: "Phe gài trục thép lò xo DIN 471", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "phe-gai" },
  { text: "Đai ốc khóa nylon SUS 304 DIN 985", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "dai-oc" },
  { text: "Vòng đệm phẳng thép mạ kẽm DIN 125", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "vong-dem" },
  { text: "Ren cấy Helicoil Inox 304", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "ren-cay" },
  { text: "Vít tự khoan đầu bằng SUS 410", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "vit-tu-khoan" },
  { text: "Thanh ren thép mạ kẽm 1m Class 4.8", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "ty-ren" },
  { text: "Bulong móng chữ L thép carbon", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "bulong-mong" },
  { text: "Long đền vê thép lò xo DIN 127", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "vong-dem" },
  { text: "Chốt chẻ thép mạ kẽm công nghiệp", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "chot" },
  { text: "Tán bầu thép mạ kẽm DIN 1587", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "tan" },
  { text: "Vít gỗ đầu tròn Philips", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "vit-go" },
  { text: "Bulong cổ vuông DIN 603", categorySlug: "linh-kien-lap-ghep", subcategorySlug: "bulong-co-vuong" },
  { text: "Ma ní chữ U mạ kẽm", categorySlug: "phu-kien-nang-ha", subcategorySlug: "ma-ni" },
  { text: "Tăng đơ cáp 2 đầu tròn Inox", categorySlug: "phu-kien-nang-ha", subcategorySlug: "tang-do-cap" },
  { text: "Đai siết ống Inox 304", categorySlug: "vat-tu-duong-ong", subcategorySlug: "dai-siet-ong" }
];

export default function ExploreMoreProducts() {
  const getLinkUrl = (link: ProductLink) => {
    if (link.subcategorySlug) {
      return `/${link.categorySlug}/${link.subcategorySlug}`;
    }
    return `/${link.categorySlug}`;
  };

  return (
    <section className="max-w-[1500px] mx-auto px-4 lg:px-8 py-12 border-t border-slate-200">
      <h2 className="text-[24px] font-bold text-[#222] mb-3">Explore More Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-12 gap-y-3">
        {MECSU_PRODUCT_LINKS.map((link, i) => (
          <Link
            key={i}
            to={getLinkUrl(link)}
            className="text-[16px] text-[#007185] hover:font-bold hover:underline transition-all leading-[1.3]"
          >
            {link.text}
          </Link>
        ))}
      </div>
    </section>
  );
}
