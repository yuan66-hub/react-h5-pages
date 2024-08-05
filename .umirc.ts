export default {
    // https://umijs.org/docs/guides/mpa
    mpa: {
        template: 'templates/default.html',
        getConfigFromEntryFile: true,
        layout: '@/layouts/basic',
        entry: {
            foo: { description: 'hello foo' },
            bar: { description: 'hello bar' },
        },
    },
    mountElementId: 'main',
};