import {defineType,defineField} from 'sanity';import {imageAccessibility} from '../validation';
export default defineType({name:'media',type:'image',options:{hotspot:true},fields:[defineField({name:'alt',type:'string'}),defineField({name:'decorative',type:'boolean',initialValue:false})],validation:r=>r.custom(imageAccessibility)});
