module.exports = function (migration) {
    const article = migration.editContentType('article')
        .name('Article')
        .description('Blog post or technical article')
        .displayField('title');

    article.editField('title')
        .name('Title')
        .type('Symbol')
        .required(true)
        .validations([{ size: { max: 200 } }]);

    article.editField('slug')
        .name('Slug')
        .type('Symbol')
        .required(true)
        .validations([
            { unique: true },
            { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
        ]);

    article.createField('publishDate').name('Publish Date').type('Date');
    article.createField('excerpt').name('Excerpt').type('Symbol').validations([{ size: { max: 300 } }]);
    article.createField('coverImage').name('Cover Image').type('Link').linkType('Asset').validations([{ linkMimetypeGroup: ['image'] }]);
    article.createField('body').name('Body').type('RichText').required(true).validations([
        {
            enabledNodeTypes: [
                'heading-1',
                'heading-2',
                'heading-3',
                'heading-4',
                'heading-5',
                'heading-6',
                'ordered-list',
                'unordered-list',
                'hr',
                'blockquote',
                'embedded-entry-block',
                'embedded-asset-block'
            ]
        },
        {
            enabledMarks: ['bold', 'italic', 'underline', 'code', 'superscript', 'subscript']
        }
    ]);
    article.createField('tags').name('Tags').type('Array').items({ type: 'Symbol' });
    article.createField('featured').name('Featured').type('Boolean').defaultValue({ 'en-US': false });
    article.createField('seoDescription').name('SEO Description').type('Symbol').validations([{ size: { max: 160 } }]);

    const caseStudy = migration.createContentType('caseStudy')
        .name('Case Study')
        .description('Long-form project case study with outcomes and metrics')
        .displayField('title');

    caseStudy.createField('title').name('Title').type('Symbol').required(true).validations([{ size: { max: 200 } }]);
    caseStudy.createField('slug')
        .name('Slug')
        .type('Symbol')
        .required(true)
        .validations([
            { unique: true },
            { regexp: { pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' } }
        ]);
    caseStudy.createField('publishDate').name('Publish Date').type('Date');
    caseStudy.createField('excerpt').name('Excerpt').type('Symbol').validations([{ size: { max: 300 } }]);
    caseStudy.createField('coverImage').name('Cover Image').type('Link').linkType('Asset').validations([{ linkMimetypeGroup: ['image'] }]);
    caseStudy.createField('body').name('Body').type('RichText').required(true);
    caseStudy.createField('tags').name('Tags').type('Array').items({ type: 'Symbol' });
    caseStudy.createField('metrics').name('Metrics').type('Object');
    caseStudy.createField('techStack').name('Tech Stack').type('Array').items({ type: 'Symbol' });
    caseStudy.createField('ctaLinks').name('Call-to-Action Links').type('Object');
};
