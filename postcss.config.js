module.exports = {
    plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
        require('css-mqpacker'),
        require('cssnano')({
            preset: [
                'default', {
                    discardComments: {
                        removeAll: true
                    }
                }
            ]
        })
    ]
}