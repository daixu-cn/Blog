/**
 * @Description: Microsoft Clarity 网站分析
 * @Author: daixu
 * @Date: 2024-01-22 14:07:33
 */

; (function (window, document) {
    function setupClarity(clarityKey) {
        window.clarity =
            window.clarity ||
            function () {
                ; (window.clarity.q = window.clarity.q || []).push(arguments)
            }

        const scriptElement = document.createElement("script")
        scriptElement.async = 1
        scriptElement.src = `https://www.clarity.ms/tag/${clarityKey}`

        const firstScriptElement = document.getElementsByTagName("script")[0]
        firstScriptElement.parentNode.insertBefore(scriptElement, firstScriptElement)
    }

    setupClarity("kplqsrbs8w")
})(window, document)
