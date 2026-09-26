import type {StructureResolver} from 'sanity/structure';
export const structure:StructureResolver=S=>S.list().title('CTRL ROOM').items([...['artist','event','session','release','archiveEntry'].map(type=>S.documentTypeListItem(type)),S.divider(),S.listItem().title('Site settings').child(S.document().schemaType('siteSettings').documentId('siteSettings'))]);
