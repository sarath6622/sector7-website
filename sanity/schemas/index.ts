import { blockContent }   from "./blockContent";
import { trainer }         from "./trainer";
import { transformation }  from "./transformation";
import { blogPost }        from "./blogPost";
import { facility }        from "./facility";
import { pricingPlan }     from "./pricingPlan";
import { testimonial }     from "./testimonial";
import { siteSettings }    from "./siteSettings";

export const schemaTypes = [
  // Shared types
  blockContent,
  // Documents
  trainer,
  transformation,
  blogPost,
  facility,
  pricingPlan,
  testimonial,
  siteSettings,
];
