import {defineType,defineField} from 'sanity';import {title,richText,links} from './shared';
export default defineType({name:'siteSettings',type:'document',fields:[title,defineField({name:'description',type:'text',validation:r=>r.required()}),richText('about'),links('contactLinks','contactLink'),links('socialLinks')]});
