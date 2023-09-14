
// ==UserScript==
// @name         猎人荒野的召唤,人口普查+雷达定位脚本,自动选择某动物(赤鹿)评分大于x的复选框
// @namespace    http://your.namespace.com
// @version      1.0
// @description  猎人荒野的召唤,人口普查+雷达定位脚本,自动选择某动物(赤鹿)评分大于x的复选框.载入页面www.mathartbang.com/deca/hp/map.html后,输入动物名字,小写+连字符_组成, 然后导入地图数据输入maxscore数
// @author       Shinkai007
// @match        https://mathartbang.com/deca/hp/map.html
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

     // 用户输入动物名称和最大分数
    var animalName = prompt("请输入动物名称（小写并且用_连接，比如red_deer）:","red_deer");
    var maxScoreThreshold
    // 创建 MutationObserver 来监视 dropzone 内容的变化
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            // 在这里检查内容是否已经加载了数据
            console.log('mutation.target', mutation.target);
            var inputElement = document.querySelector(`#dropzone input[data-population-id="${animalName}"]`);

                 if (mutation.target && inputElement) {
                     addClassNamesToUlAndSpan(inputElement);
                     console.log('展开了包含赤鹿信息的复选框')
                     selectCheckboxesByMaxScore(maxScoreThreshold);
                     maxScoreThreshold = parseFloat(prompt("请输入最大分数:",150));

            }
        });
    });

    // 添加类名到 ul 和 span，递归处理
    function addClassNamesToUlAndSpan(element) {
        if (!element) return;

        // 给元素的上一个 span 添加类名
        var spanElement = element.previousElementSibling;
        if (spanElement) {
            spanElement.classList.add('nav-caret-down');
        }

        // 给元素的下一个 ul 添加类名
        var ulElement = element.nextElementSibling;
        if (ulElement) {
            ulElement.classList.add('active');
            // 递归处理子元素
            var liElements = ulElement.querySelectorAll(`li input[data-population-id="${animalName}"]`);
            liElements.forEach(function(liElement) {
                addClassNamesToUlAndSpan(liElement);

            });
        }
    }
   // 根据最大分数选择复选框
    function selectCheckboxesByMaxScore(threshold) {
    var checkboxes = document.querySelectorAll(`input[data-population-id="${animalName}"]`);
    checkboxes.forEach(function(checkbox) {
        var text = checkbox.parentNode.textContent;
        var maxScoreMatch = text.match(/Max Score: (\d+\.\d+)/);
        if (maxScoreMatch && parseFloat(maxScoreMatch[1]) > threshold) {
            // 只选择最后一层的 input，并触发其 click 事件
            if (!checkbox.nextElementSibling) {
                var clickEvent = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                checkbox.dispatchEvent(clickEvent);
            }
        }
    });
}

    // 定义观察 dropzone 内容变化的函数
    function observeDropzone() {
        var dropzone = document.getElementById('dropzone');
        // 开始观察 dropzone 内容的变化
        observer.observe(dropzone, { childList: true, subtree: true });
    }

    // 初始观察
    observeDropzone();
})();




