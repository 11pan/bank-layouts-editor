
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function is_promise(value) {
        return value && typeof value === 'object' && typeof value.then === 'function';
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot_base(slot, slot_definition, ctx, $$scope, slot_changes, get_slot_context_fn) {
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function get_all_dirty_from_scope($$scope) {
        if ($$scope.ctx.length > 32) {
            const dirty = [];
            const length = $$scope.ctx.length / 32;
            for (let i = 0; i < length; i++) {
                dirty[i] = -1;
            }
            return dirty;
        }
        return -1;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function set_store_value(store, ret, value) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }
    class HtmlTag {
        constructor() {
            this.e = this.n = null;
        }
        c(html) {
            this.h(html);
        }
        m(html, target, anchor = null) {
            if (!this.e) {
                this.e = element(target.nodeName);
                this.t = target;
                this.c(html);
            }
            this.i(anchor);
        }
        h(html) {
            this.e.innerHTML = html;
            this.n = Array.from(this.e.childNodes);
        }
        i(anchor) {
            for (let i = 0; i < this.n.length; i += 1) {
                insert(this.t, this.n[i], anchor);
            }
        }
        p(html) {
            this.d();
            this.h(html);
            this.i(this.a);
        }
        d() {
            this.n.forEach(detach);
        }
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { stylesheet } = info;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                info.rules = {};
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            // @ts-ignore
            callbacks.slice().forEach(fn => fn.call(this, event));
        }
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function tick() {
        schedule_update();
        return resolved_promise;
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function add_flush_callback(fn) {
        flush_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                started = true;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }

    function handle_promise(promise, info) {
        const token = info.token = {};
        function update(type, index, key, value) {
            if (info.token !== token)
                return;
            info.resolved = value;
            let child_ctx = info.ctx;
            if (key !== undefined) {
                child_ctx = child_ctx.slice();
                child_ctx[key] = value;
            }
            const block = type && (info.current = type)(child_ctx);
            let needs_flush = false;
            if (info.block) {
                if (info.blocks) {
                    info.blocks.forEach((block, i) => {
                        if (i !== index && block) {
                            group_outros();
                            transition_out(block, 1, 1, () => {
                                if (info.blocks[i] === block) {
                                    info.blocks[i] = null;
                                }
                            });
                            check_outros();
                        }
                    });
                }
                else {
                    info.block.d(1);
                }
                block.c();
                transition_in(block, 1);
                block.m(info.mount(), info.anchor);
                needs_flush = true;
            }
            info.block = block;
            if (info.blocks)
                info.blocks[index] = block;
            if (needs_flush) {
                flush();
            }
        }
        if (is_promise(promise)) {
            const current_component = get_current_component();
            promise.then(value => {
                set_current_component(current_component);
                update(info.then, 1, info.value, value);
                set_current_component(null);
            }, error => {
                set_current_component(current_component);
                update(info.catch, 2, info.error, error);
                set_current_component(null);
                if (!info.hasCatch) {
                    throw error;
                }
            });
            // if we previously had a then/catch block, destroy it
            if (info.current !== info.pending) {
                update(info.pending, 0);
                return true;
            }
        }
        else {
            if (info.current !== info.then) {
                update(info.then, 1, info.value, promise);
                return true;
            }
            info.resolved = promise;
        }
    }
    function update_await_block_branch(info, ctx, dirty) {
        const child_ctx = ctx.slice();
        const { resolved } = info;
        if (info.current === info.then) {
            child_ctx[info.value] = resolved;
        }
        if (info.current === info.catch) {
            child_ctx[info.error] = resolved;
        }
        info.block.p(child_ctx, dirty);
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
    }

    function bind(component, name, callback) {
        const index = component.$$.props[name];
        if (index !== undefined) {
            component.$$.bound[index] = callback;
            callback(component.$$.ctx[index]);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.2' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const ITEM_MAP = writable({});
    const SLOTS    = writable({});
    const TAG_NAME = writable('');


    const item_names_url = "https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/items-search.json";

    const getItems = async () => {
    	let response = await fetch(item_names_url);
    	let items = await response.json();

    	ITEM_MAP.set(items);

    	return items;
    };

    /* node_modules\svelma\src\components\Icon.svelte generated by Svelte v3.46.2 */

    const file$k = "node_modules\\svelma\\src\\components\\Icon.svelte";

    function create_fragment$m(ctx) {
    	let span;
    	let i;
    	let i_class_value;
    	let span_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			span = element("span");
    			i = element("i");
    			attr_dev(i, "class", i_class_value = "" + (/*newPack*/ ctx[8] + " fa-" + /*icon*/ ctx[0] + " " + /*customClass*/ ctx[2] + " " + /*newCustomSize*/ ctx[6]));
    			add_location(i, file$k, 53, 2, 1189);
    			attr_dev(span, "class", span_class_value = "icon " + /*size*/ ctx[1] + " " + /*newType*/ ctx[7] + " " + (/*isLeft*/ ctx[4] && 'is-left' || '') + " " + (/*isRight*/ ctx[5] && 'is-right' || ''));
    			toggle_class(span, "is-clickable", /*isClickable*/ ctx[3]);
    			add_location(span, file$k, 52, 0, 1046);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, span, anchor);
    			append_dev(span, i);

    			if (!mounted) {
    				dispose = listen_dev(span, "click", /*click_handler*/ ctx[12], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*newPack, icon, customClass, newCustomSize*/ 325 && i_class_value !== (i_class_value = "" + (/*newPack*/ ctx[8] + " fa-" + /*icon*/ ctx[0] + " " + /*customClass*/ ctx[2] + " " + /*newCustomSize*/ ctx[6]))) {
    				attr_dev(i, "class", i_class_value);
    			}

    			if (dirty & /*size, newType, isLeft, isRight*/ 178 && span_class_value !== (span_class_value = "icon " + /*size*/ ctx[1] + " " + /*newType*/ ctx[7] + " " + (/*isLeft*/ ctx[4] && 'is-left' || '') + " " + (/*isRight*/ ctx[5] && 'is-right' || ''))) {
    				attr_dev(span, "class", span_class_value);
    			}

    			if (dirty & /*size, newType, isLeft, isRight, isClickable*/ 186) {
    				toggle_class(span, "is-clickable", /*isClickable*/ ctx[3]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(span);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$m.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$m($$self, $$props, $$invalidate) {
    	let newPack;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { type = '' } = $$props;
    	let { pack = 'fas' } = $$props;
    	let { icon } = $$props;
    	let { size = '' } = $$props;
    	let { customClass = '' } = $$props;
    	let { customSize = '' } = $$props;
    	let { isClickable = false } = $$props;
    	let { isLeft = false } = $$props;
    	let { isRight = false } = $$props;
    	let newCustomSize = '';
    	let newType = '';

    	const writable_props = [
    		'type',
    		'pack',
    		'icon',
    		'size',
    		'customClass',
    		'customSize',
    		'isClickable',
    		'isLeft',
    		'isRight'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	function click_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(9, type = $$props.type);
    		if ('pack' in $$props) $$invalidate(10, pack = $$props.pack);
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$props.customClass);
    		if ('customSize' in $$props) $$invalidate(11, customSize = $$props.customSize);
    		if ('isClickable' in $$props) $$invalidate(3, isClickable = $$props.isClickable);
    		if ('isLeft' in $$props) $$invalidate(4, isLeft = $$props.isLeft);
    		if ('isRight' in $$props) $$invalidate(5, isRight = $$props.isRight);
    	};

    	$$self.$capture_state = () => ({
    		type,
    		pack,
    		icon,
    		size,
    		customClass,
    		customSize,
    		isClickable,
    		isLeft,
    		isRight,
    		newCustomSize,
    		newType,
    		newPack
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(9, type = $$props.type);
    		if ('pack' in $$props) $$invalidate(10, pack = $$props.pack);
    		if ('icon' in $$props) $$invalidate(0, icon = $$props.icon);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('customClass' in $$props) $$invalidate(2, customClass = $$props.customClass);
    		if ('customSize' in $$props) $$invalidate(11, customSize = $$props.customSize);
    		if ('isClickable' in $$props) $$invalidate(3, isClickable = $$props.isClickable);
    		if ('isLeft' in $$props) $$invalidate(4, isLeft = $$props.isLeft);
    		if ('isRight' in $$props) $$invalidate(5, isRight = $$props.isRight);
    		if ('newCustomSize' in $$props) $$invalidate(6, newCustomSize = $$props.newCustomSize);
    		if ('newType' in $$props) $$invalidate(7, newType = $$props.newType);
    		if ('newPack' in $$props) $$invalidate(8, newPack = $$props.newPack);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*pack*/ 1024) {
    			$$invalidate(8, newPack = pack || 'fas');
    		}

    		if ($$self.$$.dirty & /*customSize, size*/ 2050) {
    			{
    				if (customSize) $$invalidate(6, newCustomSize = customSize); else {
    					switch (size) {
    						case 'is-small':
    							break;
    						case 'is-medium':
    							$$invalidate(6, newCustomSize = 'fa-lg');
    							break;
    						case 'is-large':
    							$$invalidate(6, newCustomSize = 'fa-3x');
    							break;
    						default:
    							$$invalidate(6, newCustomSize = '');
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*type*/ 512) {
    			{
    				if (!type) $$invalidate(7, newType = '');
    				let splitType = [];

    				if (typeof type === 'string') {
    					splitType = type.split('-');
    				} else {
    					for (let key in type) {
    						if (type[key]) {
    							splitType = key.split('-');
    							break;
    						}
    					}
    				}

    				if (splitType.length <= 1) $$invalidate(7, newType = ''); else $$invalidate(7, newType = `has-text-${splitType[1]}`);
    			}
    		}
    	};

    	return [
    		icon,
    		size,
    		customClass,
    		isClickable,
    		isLeft,
    		isRight,
    		newCustomSize,
    		newType,
    		newPack,
    		type,
    		pack,
    		customSize,
    		click_handler
    	];
    }

    class Icon$1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$m, create_fragment$m, safe_not_equal, {
    			type: 9,
    			pack: 10,
    			icon: 0,
    			size: 1,
    			customClass: 2,
    			customSize: 11,
    			isClickable: 3,
    			isLeft: 4,
    			isRight: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$m.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*icon*/ ctx[0] === undefined && !('icon' in props)) {
    			console.warn("<Icon> was created without expected prop 'icon'");
    		}
    	}

    	get type() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get pack() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set pack(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customClass() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customClass(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get customSize() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set customSize(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isClickable() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isClickable(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isLeft() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isLeft(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get isRight() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set isRight(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function cubicInOut(t) {
        return t < 0.5 ? 4.0 * t * t * t : 0.5 * Math.pow(2.0 * t - 2.0, 3.0) + 1.0;
    }
    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function blur(node, { delay = 0, duration = 400, easing = cubicInOut, amount = 5, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const f = style.filter === 'none' ? '' : style.filter;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `opacity: ${target_opacity - (od * u)}; filter: ${f} blur(${u * amount}px);`
        };
    }
    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }
    function scale(node, { delay = 0, duration = 400, easing = cubicOut, start = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const sd = 1 - start;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (_t, u) => `
			transform: ${transform} scale(${1 - (sd * u)});
			opacity: ${target_opacity - (od * u)}
		`
        };
    }
    function draw(node, { delay = 0, speed, duration, easing = cubicInOut } = {}) {
        let len = node.getTotalLength();
        const style = getComputedStyle(node);
        if (style.strokeLinecap !== 'butt') {
            len += parseInt(style.strokeWidth);
        }
        if (duration === undefined) {
            if (speed === undefined) {
                duration = 800;
            }
            else {
                duration = len / speed;
            }
        }
        else if (typeof duration === 'function') {
            duration = duration(len);
        }
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `stroke-dasharray: ${t * len} ${u * len}`
        };
    }
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    var transitions = /*#__PURE__*/Object.freeze({
        __proto__: null,
        blur: blur,
        crossfade: crossfade,
        draw: draw,
        fade: fade,
        fly: fly,
        scale: scale,
        slide: slide
    });

    function chooseAnimation(animation) {
      return typeof animation === 'function' ? animation : transitions[animation]
    }

    function isEnterKey(e) {
      return e.keyCode && e.keyCode === 13
    }

    function isEscKey(e) {
      return e.keyCode && e.keyCode === 27
    }

    function omit(obj, ...keysToOmit) {
      return Object.keys(obj).reduce((acc, key) => {
        if (keysToOmit.indexOf(key) === -1) acc[key] = obj[key];
        return acc
      }, {})
    }

    function typeToIcon(type) {
      switch (type) {
        case 'is-info':
          return 'info-circle'
        case 'is-success':
          return 'check-circle'
        case 'is-warning':
          return 'exclamation-triangle'
        case 'is-danger':
          return 'exclamation-circle'
        default:
          return null
      }
    }

    function getEventsAction(component) {
      return node => {
        const events = Object.keys(component.$$.callbacks);
        const listeners = [];
        events.forEach(event =>
          listeners.push(listen(node, event, e => bubble(component, e)))
        );
        return {
          destroy: () => {
            listeners.forEach(listener => listener());
          }
        };
      };
    }

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z$k = "";
    styleInject(css_248z$k);

    /* node_modules\svelma\src\components\Dialog\Dialog.svelte generated by Svelte v3.46.2 */
    const file$j = "node_modules\\svelma\\src\\components\\Dialog\\Dialog.svelte";

    // (199:0) {#if active}
    function create_if_block$8(ctx) {
    	let div4;
    	let div0;
    	let t0;
    	let div3;
    	let t1;
    	let section;
    	let div2;
    	let t2;
    	let div1;
    	let p;
    	let t3;
    	let t4;
    	let footer;
    	let t5;
    	let button;
    	let t6;
    	let button_class_value;
    	let div3_transition;
    	let div4_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*title*/ ctx[2] && create_if_block_4(ctx);
    	let if_block1 = /*icon*/ ctx[6] && create_if_block_3$1(ctx);
    	let if_block2 = /*hasInput*/ ctx[8] && create_if_block_2$2(ctx);
    	let if_block3 = /*showCancel*/ ctx[9] && create_if_block_1$3(ctx);

    	const block = {
    		c: function create() {
    			div4 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div3 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			section = element("section");
    			div2 = element("div");
    			if (if_block1) if_block1.c();
    			t2 = space();
    			div1 = element("div");
    			p = element("p");
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			footer = element("footer");
    			if (if_block3) if_block3.c();
    			t5 = space();
    			button = element("button");
    			t6 = text(/*confirmText*/ ctx[4]);
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$j, 200, 4, 4924);
    			add_location(p, file$j, 219, 12, 5699);
    			attr_dev(div1, "class", "media-content");
    			add_location(div1, file$j, 218, 10, 5659);
    			attr_dev(div2, "class", "media");
    			add_location(div2, file$j, 212, 8, 5462);
    			attr_dev(section, "class", "modal-card-body svelte-1gwiwqo");
    			toggle_class(section, "is-titleless", !/*title*/ ctx[2]);
    			toggle_class(section, "is-flex", /*icon*/ ctx[6]);
    			add_location(section, file$j, 211, 6, 5371);
    			attr_dev(button, "class", button_class_value = "button " + /*type*/ ctx[11] + " svelte-1gwiwqo");
    			add_location(button, file$j, 247, 8, 6504);
    			attr_dev(footer, "class", "modal-card-foot svelte-1gwiwqo");
    			add_location(footer, file$j, 238, 6, 6258);
    			attr_dev(div3, "class", "modal-card svelte-1gwiwqo");
    			add_location(div3, file$j, 201, 4, 4982);
    			attr_dev(div4, "class", div4_class_value = "modal dialog " + /*size*/ ctx[10] + " is-active" + " svelte-1gwiwqo");
    			add_location(div4, file$j, 199, 2, 4858);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div4, anchor);
    			append_dev(div4, div0);
    			append_dev(div4, t0);
    			append_dev(div4, div3);
    			if (if_block0) if_block0.m(div3, null);
    			append_dev(div3, t1);
    			append_dev(div3, section);
    			append_dev(section, div2);
    			if (if_block1) if_block1.m(div2, null);
    			append_dev(div2, t2);
    			append_dev(div2, div1);
    			append_dev(div1, p);
    			p.innerHTML = /*message*/ ctx[3];
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div3, t4);
    			append_dev(div3, footer);
    			if (if_block3) if_block3.m(footer, null);
    			append_dev(footer, t5);
    			append_dev(footer, button);
    			append_dev(button, t6);
    			/*button_binding_1*/ ctx[32](button);
    			/*div4_binding*/ ctx[33](div4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div0, "click", /*close*/ ctx[21], false, false, false),
    					listen_dev(button, "click", /*confirm*/ ctx[22], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*title*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_4(ctx);
    					if_block0.c();
    					if_block0.m(div3, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*icon*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_3$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div2, t2);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty[0] & /*message*/ 8) p.innerHTML = /*message*/ ctx[3];
    			if (/*hasInput*/ ctx[8]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);
    				} else {
    					if_block2 = create_if_block_2$2(ctx);
    					if_block2.c();
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				if_block2.d(1);
    				if_block2 = null;
    			}

    			if (dirty[0] & /*title*/ 4) {
    				toggle_class(section, "is-titleless", !/*title*/ ctx[2]);
    			}

    			if (dirty[0] & /*icon*/ 64) {
    				toggle_class(section, "is-flex", /*icon*/ ctx[6]);
    			}

    			if (/*showCancel*/ ctx[9]) {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block_1$3(ctx);
    					if_block3.c();
    					if_block3.m(footer, t5);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (!current || dirty[0] & /*confirmText*/ 16) set_data_dev(t6, /*confirmText*/ ctx[4]);

    			if (!current || dirty[0] & /*type*/ 2048 && button_class_value !== (button_class_value = "button " + /*type*/ ctx[11] + " svelte-1gwiwqo")) {
    				attr_dev(button, "class", button_class_value);
    			}

    			if (!current || dirty[0] & /*size*/ 1024 && div4_class_value !== (div4_class_value = "modal dialog " + /*size*/ ctx[10] + " is-active" + " svelte-1gwiwqo")) {
    				attr_dev(div4, "class", div4_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*_animation*/ ctx[19], /*animProps*/ ctx[12], true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, /*_animation*/ ctx[19], /*animProps*/ ctx[12], false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div4);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    			/*button_binding_1*/ ctx[32](null);
    			if (detaching && div3_transition) div3_transition.end();
    			/*div4_binding*/ ctx[33](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$8.name,
    		type: "if",
    		source: "(199:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    // (203:6) {#if title}
    function create_if_block_4(ctx) {
    	let header;
    	let p;
    	let t;

    	const block = {
    		c: function create() {
    			header = element("header");
    			p = element("p");
    			t = text(/*title*/ ctx[2]);
    			attr_dev(p, "class", "modal-card-title");
    			add_location(p, file$j, 204, 10, 5110);
    			attr_dev(header, "class", "modal-card-head svelte-1gwiwqo");
    			add_location(header, file$j, 203, 8, 5067);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, p);
    			append_dev(p, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 4) set_data_dev(t, /*title*/ ctx[2]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(203:6) {#if title}",
    		ctx
    	});

    	return block;
    }

    // (214:10) {#if icon}
    function create_if_block_3$1(ctx) {
    	let div;
    	let icon_1;
    	let current;

    	icon_1 = new Icon$1({
    			props: {
    				pack: /*iconPack*/ ctx[7],
    				icon: /*icon*/ ctx[6],
    				type: /*type*/ ctx[11],
    				size: "is-large"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			attr_dev(div, "class", "media-left");
    			add_location(div, file$j, 214, 12, 5515);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iconPack*/ 128) icon_1_changes.pack = /*iconPack*/ ctx[7];
    			if (dirty[0] & /*icon*/ 64) icon_1_changes.icon = /*icon*/ ctx[6];
    			if (dirty[0] & /*type*/ 2048) icon_1_changes.type = /*type*/ ctx[11];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(214:10) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (222:12) {#if hasInput}
    function create_if_block_2$2(ctx) {
    	let div1;
    	let div0;
    	let input_1;
    	let t0;
    	let p;
    	let t1;
    	let mounted;
    	let dispose;
    	let input_1_levels = [{ class: "input" }, /*newInputProps*/ ctx[18]];
    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			input_1 = element("input");
    			t0 = space();
    			p = element("p");
    			t1 = text(/*validationMessage*/ ctx[17]);
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-1gwiwqo", true);
    			add_location(input_1, file$j, 224, 18, 5840);
    			attr_dev(p, "class", "help is-danger");
    			add_location(p, file$j, 230, 18, 6090);
    			attr_dev(div0, "class", "control");
    			add_location(div0, file$j, 223, 16, 5800);
    			attr_dev(div1, "class", "field svelte-1gwiwqo");
    			add_location(div1, file$j, 222, 14, 5764);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			append_dev(div0, input_1);
    			if (input_1.autofocus) input_1.focus();
    			set_input_value(input_1, /*prompt*/ ctx[1]);
    			/*input_1_binding*/ ctx[29](input_1);
    			append_dev(div0, t0);
    			append_dev(div0, p);
    			append_dev(p, t1);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", /*input_1_input_handler*/ ctx[28]),
    					listen_dev(input_1, "keyup", /*keyup_handler*/ ctx[30], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				{ class: "input" },
    				dirty[0] & /*newInputProps*/ 262144 && /*newInputProps*/ ctx[18]
    			]));

    			if (dirty[0] & /*prompt*/ 2 && input_1.value !== /*prompt*/ ctx[1]) {
    				set_input_value(input_1, /*prompt*/ ctx[1]);
    			}

    			toggle_class(input_1, "svelte-1gwiwqo", true);
    			if (dirty[0] & /*validationMessage*/ 131072) set_data_dev(t1, /*validationMessage*/ ctx[17]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			/*input_1_binding*/ ctx[29](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$2.name,
    		type: "if",
    		source: "(222:12) {#if hasInput}",
    		ctx
    	});

    	return block;
    }

    // (240:8) {#if showCancel}
    function create_if_block_1$3(ctx) {
    	let button;
    	let t;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			t = text(/*cancelText*/ ctx[5]);
    			attr_dev(button, "class", "button svelte-1gwiwqo");
    			add_location(button, file$j, 240, 10, 6326);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			append_dev(button, t);
    			/*button_binding*/ ctx[31](button);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*cancel*/ ctx[20], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*cancelText*/ 32) set_data_dev(t, /*cancelText*/ ctx[5]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			/*button_binding*/ ctx[31](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$3.name,
    		type: "if",
    		source: "(240:8) {#if showCancel}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$l(ctx) {
    	let if_block_anchor;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*active*/ ctx[0] && create_if_block$8(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(window, "keydown", /*keydown*/ ctx[23], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$l.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$l($$self, $$props, $$invalidate) {
    	let _animation;
    	let newInputProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Dialog', slots, []);
    	let { title = '' } = $$props;
    	let { message } = $$props;
    	let { confirmText = 'OK' } = $$props;
    	let { cancelText = 'Cancel' } = $$props;
    	let { focusOn = 'confirm' } = $$props;
    	let { icon = '' } = $$props;
    	let { iconPack = '' } = $$props;
    	let { hasInput = false } = $$props;
    	let { prompt = null } = $$props;
    	let { showCancel = false } = $$props;
    	let { size = '' } = $$props;
    	let { type = 'is-primary' } = $$props;
    	let { active = true } = $$props;
    	let { animation = 'scale' } = $$props;
    	let { animProps = { start: 1.2 } } = $$props;
    	let { inputProps = {} } = $$props;

    	// export let showClose = true
    	let resolve;

    	let { appendToBody = true } = $$props;
    	let modal;
    	let cancelButton;
    	let confirmButton;
    	let input;
    	let validationMessage = '';
    	const dispatch = createEventDispatcher();

    	onMount(async () => {
    		await tick();

    		if (hasInput) {
    			input.focus();
    		} else if (focusOn === 'cancel' && showCancel) {
    			cancelButton.focus();
    		} else {
    			confirmButton.focus();
    		}
    	});

    	function cancel() {
    		resolve(hasInput ? null : false);
    		close();
    	}

    	function close() {
    		resolve(hasInput ? null : false);
    		$$invalidate(0, active = false);
    		dispatch('destroy');
    	}

    	async function confirm() {
    		if (input && !input.checkValidity()) {
    			$$invalidate(17, validationMessage = input.validationMessage);
    			await tick();
    			input.select();
    			return;
    		}

    		$$invalidate(17, validationMessage = '');
    		resolve(hasInput ? prompt : true);
    		close();
    	}

    	function keydown(e) {
    		if (active && isEscKey(e)) {
    			close();
    		}
    	}

    	const writable_props = [
    		'title',
    		'message',
    		'confirmText',
    		'cancelText',
    		'focusOn',
    		'icon',
    		'iconPack',
    		'hasInput',
    		'prompt',
    		'showCancel',
    		'size',
    		'type',
    		'active',
    		'animation',
    		'animProps',
    		'inputProps',
    		'appendToBody'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Dialog> was created with unknown prop '${key}'`);
    	});

    	function input_1_input_handler() {
    		prompt = this.value;
    		$$invalidate(1, prompt);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(16, input);
    		});
    	}

    	const keyup_handler = e => isEnterKey(e) && confirm();

    	function button_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			cancelButton = $$value;
    			$$invalidate(14, cancelButton);
    		});
    	}

    	function button_binding_1($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			confirmButton = $$value;
    			$$invalidate(15, confirmButton);
    		});
    	}

    	function div4_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(13, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    		if ('confirmText' in $$props) $$invalidate(4, confirmText = $$props.confirmText);
    		if ('cancelText' in $$props) $$invalidate(5, cancelText = $$props.cancelText);
    		if ('focusOn' in $$props) $$invalidate(24, focusOn = $$props.focusOn);
    		if ('icon' in $$props) $$invalidate(6, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(7, iconPack = $$props.iconPack);
    		if ('hasInput' in $$props) $$invalidate(8, hasInput = $$props.hasInput);
    		if ('prompt' in $$props) $$invalidate(1, prompt = $$props.prompt);
    		if ('showCancel' in $$props) $$invalidate(9, showCancel = $$props.showCancel);
    		if ('size' in $$props) $$invalidate(10, size = $$props.size);
    		if ('type' in $$props) $$invalidate(11, type = $$props.type);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('animation' in $$props) $$invalidate(25, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(12, animProps = $$props.animProps);
    		if ('inputProps' in $$props) $$invalidate(26, inputProps = $$props.inputProps);
    		if ('appendToBody' in $$props) $$invalidate(27, appendToBody = $$props.appendToBody);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		tick,
    		Icon: Icon$1,
    		chooseAnimation,
    		isEnterKey,
    		isEscKey,
    		title,
    		message,
    		confirmText,
    		cancelText,
    		focusOn,
    		icon,
    		iconPack,
    		hasInput,
    		prompt,
    		showCancel,
    		size,
    		type,
    		active,
    		animation,
    		animProps,
    		inputProps,
    		resolve,
    		appendToBody,
    		modal,
    		cancelButton,
    		confirmButton,
    		input,
    		validationMessage,
    		dispatch,
    		cancel,
    		close,
    		confirm,
    		keydown,
    		newInputProps,
    		_animation
    	});

    	$$self.$inject_state = $$props => {
    		if ('title' in $$props) $$invalidate(2, title = $$props.title);
    		if ('message' in $$props) $$invalidate(3, message = $$props.message);
    		if ('confirmText' in $$props) $$invalidate(4, confirmText = $$props.confirmText);
    		if ('cancelText' in $$props) $$invalidate(5, cancelText = $$props.cancelText);
    		if ('focusOn' in $$props) $$invalidate(24, focusOn = $$props.focusOn);
    		if ('icon' in $$props) $$invalidate(6, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(7, iconPack = $$props.iconPack);
    		if ('hasInput' in $$props) $$invalidate(8, hasInput = $$props.hasInput);
    		if ('prompt' in $$props) $$invalidate(1, prompt = $$props.prompt);
    		if ('showCancel' in $$props) $$invalidate(9, showCancel = $$props.showCancel);
    		if ('size' in $$props) $$invalidate(10, size = $$props.size);
    		if ('type' in $$props) $$invalidate(11, type = $$props.type);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('animation' in $$props) $$invalidate(25, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(12, animProps = $$props.animProps);
    		if ('inputProps' in $$props) $$invalidate(26, inputProps = $$props.inputProps);
    		if ('resolve' in $$props) resolve = $$props.resolve;
    		if ('appendToBody' in $$props) $$invalidate(27, appendToBody = $$props.appendToBody);
    		if ('modal' in $$props) $$invalidate(13, modal = $$props.modal);
    		if ('cancelButton' in $$props) $$invalidate(14, cancelButton = $$props.cancelButton);
    		if ('confirmButton' in $$props) $$invalidate(15, confirmButton = $$props.confirmButton);
    		if ('input' in $$props) $$invalidate(16, input = $$props.input);
    		if ('validationMessage' in $$props) $$invalidate(17, validationMessage = $$props.validationMessage);
    		if ('newInputProps' in $$props) $$invalidate(18, newInputProps = $$props.newInputProps);
    		if ('_animation' in $$props) $$invalidate(19, _animation = $$props._animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*animation*/ 33554432) {
    			$$invalidate(19, _animation = chooseAnimation(animation));
    		}

    		if ($$self.$$.dirty[0] & /*modal, active, appendToBody*/ 134225921) {
    			{
    				if (modal && active && appendToBody) {
    					modal.parentNode?.removeChild(modal);
    					document.body.appendChild(modal);
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*inputProps*/ 67108864) {
    			$$invalidate(18, newInputProps = { required: true, ...inputProps });
    		}
    	};

    	return [
    		active,
    		prompt,
    		title,
    		message,
    		confirmText,
    		cancelText,
    		icon,
    		iconPack,
    		hasInput,
    		showCancel,
    		size,
    		type,
    		animProps,
    		modal,
    		cancelButton,
    		confirmButton,
    		input,
    		validationMessage,
    		newInputProps,
    		_animation,
    		cancel,
    		close,
    		confirm,
    		keydown,
    		focusOn,
    		animation,
    		inputProps,
    		appendToBody,
    		input_1_input_handler,
    		input_1_binding,
    		keyup_handler,
    		button_binding,
    		button_binding_1,
    		div4_binding
    	];
    }

    class Dialog extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$l,
    			create_fragment$l,
    			safe_not_equal,
    			{
    				title: 2,
    				message: 3,
    				confirmText: 4,
    				cancelText: 5,
    				focusOn: 24,
    				icon: 6,
    				iconPack: 7,
    				hasInput: 8,
    				prompt: 1,
    				showCancel: 9,
    				size: 10,
    				type: 11,
    				active: 0,
    				animation: 25,
    				animProps: 12,
    				inputProps: 26,
    				appendToBody: 27
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Dialog",
    			options,
    			id: create_fragment$l.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[3] === undefined && !('message' in props)) {
    			console.warn("<Dialog> was created without expected prop 'message'");
    		}
    	}

    	get title() {
    		return this.$$.ctx[2];
    	}

    	set title(title) {
    		this.$$set({ title });
    		flush();
    	}

    	get message() {
    		return this.$$.ctx[3];
    	}

    	set message(message) {
    		this.$$set({ message });
    		flush();
    	}

    	get confirmText() {
    		return this.$$.ctx[4];
    	}

    	set confirmText(confirmText) {
    		this.$$set({ confirmText });
    		flush();
    	}

    	get cancelText() {
    		return this.$$.ctx[5];
    	}

    	set cancelText(cancelText) {
    		this.$$set({ cancelText });
    		flush();
    	}

    	get focusOn() {
    		return this.$$.ctx[24];
    	}

    	set focusOn(focusOn) {
    		this.$$set({ focusOn });
    		flush();
    	}

    	get icon() {
    		return this.$$.ctx[6];
    	}

    	set icon(icon) {
    		this.$$set({ icon });
    		flush();
    	}

    	get iconPack() {
    		return this.$$.ctx[7];
    	}

    	set iconPack(iconPack) {
    		this.$$set({ iconPack });
    		flush();
    	}

    	get hasInput() {
    		return this.$$.ctx[8];
    	}

    	set hasInput(hasInput) {
    		this.$$set({ hasInput });
    		flush();
    	}

    	get prompt() {
    		return this.$$.ctx[1];
    	}

    	set prompt(prompt) {
    		this.$$set({ prompt });
    		flush();
    	}

    	get showCancel() {
    		return this.$$.ctx[9];
    	}

    	set showCancel(showCancel) {
    		this.$$set({ showCancel });
    		flush();
    	}

    	get size() {
    		return this.$$.ctx[10];
    	}

    	set size(size) {
    		this.$$set({ size });
    		flush();
    	}

    	get type() {
    		return this.$$.ctx[11];
    	}

    	set type(type) {
    		this.$$set({ type });
    		flush();
    	}

    	get active() {
    		return this.$$.ctx[0];
    	}

    	set active(active) {
    		this.$$set({ active });
    		flush();
    	}

    	get animation() {
    		return this.$$.ctx[25];
    	}

    	set animation(animation) {
    		this.$$set({ animation });
    		flush();
    	}

    	get animProps() {
    		return this.$$.ctx[12];
    	}

    	set animProps(animProps) {
    		this.$$set({ animProps });
    		flush();
    	}

    	get inputProps() {
    		return this.$$.ctx[26];
    	}

    	set inputProps(inputProps) {
    		this.$$set({ inputProps });
    		flush();
    	}

    	get appendToBody() {
    		return this.$$.ctx[27];
    	}

    	set appendToBody(appendToBody) {
    		this.$$set({ appendToBody });
    		flush();
    	}
    }

    function createDialog(props) {
      if (typeof props === 'string') props = { message: props };

      const dialog = new Dialog({
        target: document.body,
        props,
        intro: true,
      });

      dialog.$on('destroy', () => {
        dialog.$destroy();
      });

      return dialog.promise
    }

    function alert(props) {
      return createDialog(props);
    }

    function confirm(props) {
      if (typeof props === 'string') props = { message: props };

      return createDialog({ showCancel: true, ...props });
    }

    function prompt(props) {
      if (typeof props === 'string') props = { message: props };

      return createDialog({ hasInput: true, confirmText: 'Done', ...props });
    }

    Dialog.alert = alert;
    Dialog.confirm = confirm;
    Dialog.prompt = prompt;

    var css_248z$j = "";
    styleInject(css_248z$j);

    /* node_modules\svelma\src\components\Field.svelte generated by Svelte v3.46.2 */
    const file$i = "node_modules\\svelma\\src\\components\\Field.svelte";
    const get_default_slot_changes$1 = dirty => ({ statusType: dirty & /*type*/ 1 });
    const get_default_slot_context$1 = ctx => ({ statusType: /*type*/ ctx[0] });

    // (105:2) {#if label}
    function create_if_block_1$2(ctx) {
    	let label_1;
    	let t;

    	const block = {
    		c: function create() {
    			label_1 = element("label");
    			t = text(/*label*/ ctx[1]);
    			attr_dev(label_1, "for", /*labelFor*/ ctx[2]);
    			attr_dev(label_1, "class", "label");
    			add_location(label_1, file$i, 105, 4, 2654);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label_1, anchor);
    			append_dev(label_1, t);
    			/*label_1_binding*/ ctx[19](label_1);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*label*/ 2) set_data_dev(t, /*label*/ ctx[1]);

    			if (dirty & /*labelFor*/ 4) {
    				attr_dev(label_1, "for", /*labelFor*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label_1);
    			/*label_1_binding*/ ctx[19](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(105:2) {#if label}",
    		ctx
    	});

    	return block;
    }

    // (109:2) {#if message}
    function create_if_block$7(ctx) {
    	let p;
    	let t;
    	let p_class_value;

    	const block = {
    		c: function create() {
    			p = element("p");
    			t = text(/*message*/ ctx[3]);
    			attr_dev(p, "class", p_class_value = "help " + /*type*/ ctx[0] + " svelte-1m7or");
    			add_location(p, file$i, 109, 4, 2783);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, p, anchor);
    			append_dev(p, t);
    			/*p_binding*/ ctx[20](p);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 8) set_data_dev(t, /*message*/ ctx[3]);

    			if (dirty & /*type*/ 1 && p_class_value !== (p_class_value = "help " + /*type*/ ctx[0] + " svelte-1m7or")) {
    				attr_dev(p, "class", p_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(p);
    			/*p_binding*/ ctx[20](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(109:2) {#if message}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let div_class_value;
    	let current;
    	let if_block0 = /*label*/ ctx[1] && create_if_block_1$2(ctx);
    	const default_slot_template = /*#slots*/ ctx[18].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[17], get_default_slot_context$1);
    	let if_block1 = /*message*/ ctx[3] && create_if_block$7(ctx);

    	let div_levels = [
    		/*props*/ ctx[11],
    		{
    			class: div_class_value = "field " + /*type*/ ctx[0] + " " + /*fieldType*/ ctx[9] + " " + /*newPosition*/ ctx[10] + " " + (/*$$props*/ ctx[12].class || '')
    		}
    	];

    	let div_data = {};

    	for (let i = 0; i < div_levels.length; i += 1) {
    		div_data = assign(div_data, div_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block1) if_block1.c();
    			set_attributes(div, div_data);
    			toggle_class(div, "is-expanded", /*expanded*/ ctx[5]);
    			toggle_class(div, "is-grouped-multiline", /*groupMultiline*/ ctx[4]);
    			toggle_class(div, "svelte-1m7or", true);
    			add_location(div, file$i, 103, 0, 2462);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t0);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			append_dev(div, t1);
    			if (if_block1) if_block1.m(div, null);
    			/*div_binding*/ ctx[21](div);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*label*/ ctx[1]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, type*/ 131073)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[17],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[17])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[17], dirty, get_default_slot_changes$1),
    						get_default_slot_context$1
    					);
    				}
    			}

    			if (/*message*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$7(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			set_attributes(div, div_data = get_spread_update(div_levels, [
    				dirty & /*props*/ 2048 && /*props*/ ctx[11],
    				(!current || dirty & /*type, fieldType, newPosition, $$props*/ 5633 && div_class_value !== (div_class_value = "field " + /*type*/ ctx[0] + " " + /*fieldType*/ ctx[9] + " " + /*newPosition*/ ctx[10] + " " + (/*$$props*/ ctx[12].class || ''))) && { class: div_class_value }
    			]));

    			toggle_class(div, "is-expanded", /*expanded*/ ctx[5]);
    			toggle_class(div, "is-grouped-multiline", /*groupMultiline*/ ctx[4]);
    			toggle_class(div, "svelte-1m7or", true);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (default_slot) default_slot.d(detaching);
    			if (if_block1) if_block1.d();
    			/*div_binding*/ ctx[21](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let props;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Field', slots, ['default']);
    	let { type = '' } = $$props;
    	let { label = null } = $$props;
    	let { labelFor = '' } = $$props;
    	let { message = '' } = $$props;
    	let { grouped = false } = $$props;
    	let { groupMultiline = false } = $$props;
    	let { position = '' } = $$props;
    	let { addons = true } = $$props;
    	let { expanded = false } = $$props;
    	setContext('type', () => type);
    	let el;
    	let labelEl;
    	let messageEl;
    	let fieldType = '';
    	let hasIcons = false;
    	let iconType = '';
    	let mounted = false;
    	let newPosition = '';

    	onMount(() => {
    		$$invalidate(16, mounted = true);
    	});

    	function label_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			labelEl = $$value;
    			$$invalidate(7, labelEl);
    		});
    	}

    	function p_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			messageEl = $$value;
    			$$invalidate(8, messageEl);
    		});
    	}

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(6, el);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('type' in $$new_props) $$invalidate(0, type = $$new_props.type);
    		if ('label' in $$new_props) $$invalidate(1, label = $$new_props.label);
    		if ('labelFor' in $$new_props) $$invalidate(2, labelFor = $$new_props.labelFor);
    		if ('message' in $$new_props) $$invalidate(3, message = $$new_props.message);
    		if ('grouped' in $$new_props) $$invalidate(13, grouped = $$new_props.grouped);
    		if ('groupMultiline' in $$new_props) $$invalidate(4, groupMultiline = $$new_props.groupMultiline);
    		if ('position' in $$new_props) $$invalidate(14, position = $$new_props.position);
    		if ('addons' in $$new_props) $$invalidate(15, addons = $$new_props.addons);
    		if ('expanded' in $$new_props) $$invalidate(5, expanded = $$new_props.expanded);
    		if ('$$scope' in $$new_props) $$invalidate(17, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		setContext,
    		omit,
    		type,
    		label,
    		labelFor,
    		message,
    		grouped,
    		groupMultiline,
    		position,
    		addons,
    		expanded,
    		el,
    		labelEl,
    		messageEl,
    		fieldType,
    		hasIcons,
    		iconType,
    		mounted,
    		newPosition,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ('type' in $$props) $$invalidate(0, type = $$new_props.type);
    		if ('label' in $$props) $$invalidate(1, label = $$new_props.label);
    		if ('labelFor' in $$props) $$invalidate(2, labelFor = $$new_props.labelFor);
    		if ('message' in $$props) $$invalidate(3, message = $$new_props.message);
    		if ('grouped' in $$props) $$invalidate(13, grouped = $$new_props.grouped);
    		if ('groupMultiline' in $$props) $$invalidate(4, groupMultiline = $$new_props.groupMultiline);
    		if ('position' in $$props) $$invalidate(14, position = $$new_props.position);
    		if ('addons' in $$props) $$invalidate(15, addons = $$new_props.addons);
    		if ('expanded' in $$props) $$invalidate(5, expanded = $$new_props.expanded);
    		if ('el' in $$props) $$invalidate(6, el = $$new_props.el);
    		if ('labelEl' in $$props) $$invalidate(7, labelEl = $$new_props.labelEl);
    		if ('messageEl' in $$props) $$invalidate(8, messageEl = $$new_props.messageEl);
    		if ('fieldType' in $$props) $$invalidate(9, fieldType = $$new_props.fieldType);
    		if ('hasIcons' in $$props) hasIcons = $$new_props.hasIcons;
    		if ('iconType' in $$props) iconType = $$new_props.iconType;
    		if ('mounted' in $$props) $$invalidate(16, mounted = $$new_props.mounted);
    		if ('newPosition' in $$props) $$invalidate(10, newPosition = $$new_props.newPosition);
    		if ('props' in $$props) $$invalidate(11, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type*/ 1) {
    			// Determine the icon type
    			{
    				if (['is-danger', 'is-success'].includes(type)) {
    					iconType = type;
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*grouped, mounted, el, labelEl, messageEl, addons*/ 106944) {
    			{
    				if (grouped) $$invalidate(9, fieldType = 'is-grouped'); else if (mounted) {
    					const childNodes = Array.prototype.filter.call(el.children, c => ![labelEl, messageEl].includes(c));

    					if (childNodes.length > 1 && addons) {
    						$$invalidate(9, fieldType = 'has-addons');
    					}
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*position, grouped*/ 24576) {
    			// Update has-addons-* or is-grouped-* classes based on position prop
    			{
    				if (position) {
    					const pos = position.split('-');

    					if (pos.length >= 1) {
    						const prefix = grouped ? 'is-grouped-' : 'has-addons-';
    						$$invalidate(10, newPosition = prefix + pos[1]);
    					}
    				}
    			}
    		}

    		$$invalidate(11, props = {
    			...omit($$props, 'addons', 'class', 'expanded', 'grouped', 'label', 'labelFor', 'position', 'type')
    		});
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		type,
    		label,
    		labelFor,
    		message,
    		groupMultiline,
    		expanded,
    		el,
    		labelEl,
    		messageEl,
    		fieldType,
    		newPosition,
    		props,
    		$$props,
    		grouped,
    		position,
    		addons,
    		mounted,
    		$$scope,
    		slots,
    		label_1_binding,
    		p_binding,
    		div_binding
    	];
    }

    class Field extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			type: 0,
    			label: 1,
    			labelFor: 2,
    			message: 3,
    			grouped: 13,
    			groupMultiline: 4,
    			position: 14,
    			addons: 15,
    			expanded: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Field",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get type() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get label() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get labelFor() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set labelFor(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get message() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get grouped() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set grouped(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get groupMultiline() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set groupMultiline(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get addons() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set addons(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$i = "";
    styleInject(css_248z$i);

    /* node_modules\svelma\src\components\Input.svelte generated by Svelte v3.46.2 */
    const file$h = "node_modules\\svelma\\src\\components\\Input.svelte";

    // (156:2) {:else}
    function create_else_block(ctx) {
    	let textarea;
    	let textarea_class_value;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		/*props*/ ctx[20],
    		{ value: /*value*/ ctx[0] },
    		{
    			class: textarea_class_value = "textarea " + /*statusType*/ ctx[11] + " " + /*size*/ ctx[2]
    		},
    		{ disabled: /*disabled*/ ctx[10] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			textarea = element("textarea");
    			set_attributes(textarea, textarea_data);
    			toggle_class(textarea, "svelte-1v5s752", true);
    			add_location(textarea, file$h, 156, 4, 3907);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, textarea, anchor);
    			if (textarea.autofocus) textarea.focus();
    			/*textarea_binding*/ ctx[31](textarea);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*events*/ ctx[25].call(null, textarea)),
    					listen_dev(textarea, "input", /*onInput*/ ctx[22], false, false, false),
    					listen_dev(textarea, "focus", /*onFocus*/ ctx[23], false, false, false),
    					listen_dev(textarea, "blur", /*onBlur*/ ctx[24], false, false, false),
    					listen_dev(textarea, "change", /*change_handler_1*/ ctx[29], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				dirty[0] & /*props*/ 1048576 && /*props*/ ctx[20],
    				dirty[0] & /*value*/ 1 && { value: /*value*/ ctx[0] },
    				dirty[0] & /*statusType, size*/ 2052 && textarea_class_value !== (textarea_class_value = "textarea " + /*statusType*/ ctx[11] + " " + /*size*/ ctx[2]) && { class: textarea_class_value },
    				dirty[0] & /*disabled*/ 1024 && { disabled: /*disabled*/ ctx[10] }
    			]));

    			toggle_class(textarea, "svelte-1v5s752", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(textarea);
    			/*textarea_binding*/ ctx[31](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(156:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (143:2) {#if type !== 'textarea'}
    function create_if_block_3(ctx) {
    	let input_1;
    	let input_1_class_value;
    	let mounted;
    	let dispose;

    	let input_1_levels = [
    		/*props*/ ctx[20],
    		{ type: /*newType*/ ctx[14] },
    		{ value: /*value*/ ctx[0] },
    		{
    			class: input_1_class_value = "input " + /*statusType*/ ctx[11] + " " + /*size*/ ctx[2] + " " + (/*$$props*/ ctx[26].class || '')
    		},
    		{ disabled: /*disabled*/ ctx[10] }
    	];

    	let input_1_data = {};

    	for (let i = 0; i < input_1_levels.length; i += 1) {
    		input_1_data = assign(input_1_data, input_1_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element("input");
    			set_attributes(input_1, input_1_data);
    			toggle_class(input_1, "svelte-1v5s752", true);
    			add_location(input_1, file$h, 143, 4, 3622);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			input_1.value = input_1_data.value;
    			if (input_1.autofocus) input_1.focus();
    			/*input_1_binding*/ ctx[30](input_1);

    			if (!mounted) {
    				dispose = [
    					action_destroyer(/*events*/ ctx[25].call(null, input_1)),
    					listen_dev(input_1, "input", /*onInput*/ ctx[22], false, false, false),
    					listen_dev(input_1, "focus", /*onFocus*/ ctx[23], false, false, false),
    					listen_dev(input_1, "blur", /*onBlur*/ ctx[24], false, false, false),
    					listen_dev(input_1, "change", /*change_handler*/ ctx[28], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			set_attributes(input_1, input_1_data = get_spread_update(input_1_levels, [
    				dirty[0] & /*props*/ 1048576 && /*props*/ ctx[20],
    				dirty[0] & /*newType*/ 16384 && { type: /*newType*/ ctx[14] },
    				dirty[0] & /*value*/ 1 && input_1.value !== /*value*/ ctx[0] && { value: /*value*/ ctx[0] },
    				dirty[0] & /*statusType, size, $$props*/ 67110916 && input_1_class_value !== (input_1_class_value = "input " + /*statusType*/ ctx[11] + " " + /*size*/ ctx[2] + " " + (/*$$props*/ ctx[26].class || '')) && { class: input_1_class_value },
    				dirty[0] & /*disabled*/ 1024 && { disabled: /*disabled*/ ctx[10] }
    			]));

    			if ('value' in input_1_data) {
    				input_1.value = input_1_data.value;
    			}

    			toggle_class(input_1, "svelte-1v5s752", true);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			/*input_1_binding*/ ctx[30](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(143:2) {#if type !== 'textarea'}",
    		ctx
    	});

    	return block;
    }

    // (171:2) {#if icon}
    function create_if_block_2$1(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon$1({
    			props: {
    				pack: /*iconPack*/ ctx[9],
    				isLeft: true,
    				icon: /*icon*/ ctx[8]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*iconPack*/ 512) icon_1_changes.pack = /*iconPack*/ ctx[9];
    			if (dirty[0] & /*icon*/ 256) icon_1_changes.icon = /*icon*/ ctx[8];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(171:2) {#if icon}",
    		ctx
    	});

    	return block;
    }

    // (178:2) {#if !loading && (passwordReveal || statusType)}
    function create_if_block_1$1(ctx) {
    	let icon_1;
    	let current;

    	icon_1 = new Icon$1({
    			props: {
    				pack: "fas",
    				isRight: true,
    				isClickable: /*passwordReveal*/ ctx[4],
    				icon: /*passwordReveal*/ ctx[4]
    				? /*passwordVisibleIcon*/ ctx[17]
    				: /*statusTypeIcon*/ ctx[15],
    				type: !/*passwordReveal*/ ctx[4]
    				? /*statusType*/ ctx[11]
    				: 'is-primary'
    			},
    			$$inline: true
    		});

    	icon_1.$on("click", /*togglePasswordVisibility*/ ctx[21]);

    	const block = {
    		c: function create() {
    			create_component(icon_1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty[0] & /*passwordReveal*/ 16) icon_1_changes.isClickable = /*passwordReveal*/ ctx[4];

    			if (dirty[0] & /*passwordReveal, passwordVisibleIcon, statusTypeIcon*/ 163856) icon_1_changes.icon = /*passwordReveal*/ ctx[4]
    			? /*passwordVisibleIcon*/ ctx[17]
    			: /*statusTypeIcon*/ ctx[15];

    			if (dirty[0] & /*passwordReveal, statusType*/ 2064) icon_1_changes.type = !/*passwordReveal*/ ctx[4]
    			? /*statusType*/ ctx[11]
    			: 'is-primary';

    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(178:2) {#if !loading && (passwordReveal || statusType)}",
    		ctx
    	});

    	return block;
    }

    // (190:2) {#if maxlength && hasCounter && type !== 'number'}
    function create_if_block$6(ctx) {
    	let small;
    	let t0;
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			small = element("small");
    			t0 = text(/*valueLength*/ ctx[16]);
    			t1 = text(" / ");
    			t2 = text(/*maxlength*/ ctx[5]);
    			attr_dev(small, "class", "help counter svelte-1v5s752");
    			toggle_class(small, "is-invisible", !/*isFocused*/ ctx[13]);
    			add_location(small, file$h, 190, 4, 4664);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, small, anchor);
    			append_dev(small, t0);
    			append_dev(small, t1);
    			append_dev(small, t2);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*valueLength*/ 65536) set_data_dev(t0, /*valueLength*/ ctx[16]);
    			if (dirty[0] & /*maxlength*/ 32) set_data_dev(t2, /*maxlength*/ ctx[5]);

    			if (dirty[0] & /*isFocused*/ 8192) {
    				toggle_class(small, "is-invisible", !/*isFocused*/ ctx[13]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(small);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(190:2) {#if maxlength && hasCounter && type !== 'number'}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let t2;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*type*/ ctx[1] !== 'textarea') return create_if_block_3;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);
    	let if_block1 = /*icon*/ ctx[8] && create_if_block_2$1(ctx);
    	let if_block2 = !/*loading*/ ctx[7] && (/*passwordReveal*/ ctx[4] || /*statusType*/ ctx[11]) && create_if_block_1$1(ctx);
    	let if_block3 = /*maxlength*/ ctx[5] && /*hasCounter*/ ctx[6] && /*type*/ ctx[1] !== 'number' && create_if_block$6(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if_block0.c();
    			t0 = space();
    			if (if_block1) if_block1.c();
    			t1 = space();
    			if (if_block2) if_block2.c();
    			t2 = space();
    			if (if_block3) if_block3.c();
    			attr_dev(div, "class", "control svelte-1v5s752");
    			toggle_class(div, "has-icons-left", /*hasIconLeft*/ ctx[19]);
    			toggle_class(div, "has-icons-right", /*hasIconRight*/ ctx[18]);
    			toggle_class(div, "is-loading", /*loading*/ ctx[7]);
    			toggle_class(div, "is-expanded", /*expanded*/ ctx[3]);
    			add_location(div, file$h, 140, 0, 3439);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			if_block0.m(div, null);
    			append_dev(div, t0);
    			if (if_block1) if_block1.m(div, null);
    			append_dev(div, t1);
    			if (if_block2) if_block2.m(div, null);
    			append_dev(div, t2);
    			if (if_block3) if_block3.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div, t0);
    				}
    			}

    			if (/*icon*/ ctx[8]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty[0] & /*icon*/ 256) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_2$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (!/*loading*/ ctx[7] && (/*passwordReveal*/ ctx[4] || /*statusType*/ ctx[11])) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty[0] & /*loading, passwordReveal, statusType*/ 2192) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block_1$1(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div, t2);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (/*maxlength*/ ctx[5] && /*hasCounter*/ ctx[6] && /*type*/ ctx[1] !== 'number') {
    				if (if_block3) {
    					if_block3.p(ctx, dirty);
    				} else {
    					if_block3 = create_if_block$6(ctx);
    					if_block3.c();
    					if_block3.m(div, null);
    				}
    			} else if (if_block3) {
    				if_block3.d(1);
    				if_block3 = null;
    			}

    			if (dirty[0] & /*hasIconLeft*/ 524288) {
    				toggle_class(div, "has-icons-left", /*hasIconLeft*/ ctx[19]);
    			}

    			if (dirty[0] & /*hasIconRight*/ 262144) {
    				toggle_class(div, "has-icons-right", /*hasIconRight*/ ctx[18]);
    			}

    			if (dirty[0] & /*loading*/ 128) {
    				toggle_class(div, "is-loading", /*loading*/ ctx[7]);
    			}

    			if (dirty[0] & /*expanded*/ 8) {
    				toggle_class(div, "is-expanded", /*expanded*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(if_block2);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(if_block2);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (if_block3) if_block3.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let props;
    	let hasIconLeft;
    	let hasIconRight;
    	let passwordVisibleIcon;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let { value = '' } = $$props;
    	let { type = 'text' } = $$props;
    	let { size = '' } = $$props;
    	let { expanded = false } = $$props;
    	let { passwordReveal = false } = $$props;
    	let { maxlength = null } = $$props;
    	let { hasCounter = true } = $$props;
    	let { loading = false } = $$props;
    	let { icon = '' } = $$props;
    	let { iconPack = '' } = $$props;
    	let { disabled = false } = $$props;
    	let input;
    	let isFocused;
    	let isPasswordVisible = false;
    	let newType = 'text';
    	let statusType = '';
    	let statusTypeIcon = '';
    	let valueLength = null;
    	const dispatch = createEventDispatcher();
    	const getType = getContext('type');
    	if (getType) statusType = getType() || '';

    	onMount(() => {
    		$$invalidate(14, newType = type);
    	});

    	async function togglePasswordVisibility() {
    		$$invalidate(27, isPasswordVisible = !isPasswordVisible);
    		$$invalidate(14, newType = isPasswordVisible ? 'text' : 'password');
    		await tick();
    		input.focus();
    	}

    	const onInput = e => {
    		$$invalidate(0, value = e.target.value);
    		$$invalidate(26, $$props.value = value, $$props);
    		dispatch('input', e);
    	};

    	const onFocus = () => $$invalidate(13, isFocused = true);
    	const onBlur = () => $$invalidate(13, isFocused = false);
    	const events = getEventsAction(current_component);

    	function change_handler(event) {
    		bubble.call(this, $$self, event);
    	}

    	function change_handler_1(event) {
    		bubble.call(this, $$self, event);
    	}

    	function input_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(12, input);
    		});
    	}

    	function textarea_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			input = $$value;
    			$$invalidate(12, input);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(26, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('value' in $$new_props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    		if ('size' in $$new_props) $$invalidate(2, size = $$new_props.size);
    		if ('expanded' in $$new_props) $$invalidate(3, expanded = $$new_props.expanded);
    		if ('passwordReveal' in $$new_props) $$invalidate(4, passwordReveal = $$new_props.passwordReveal);
    		if ('maxlength' in $$new_props) $$invalidate(5, maxlength = $$new_props.maxlength);
    		if ('hasCounter' in $$new_props) $$invalidate(6, hasCounter = $$new_props.hasCounter);
    		if ('loading' in $$new_props) $$invalidate(7, loading = $$new_props.loading);
    		if ('icon' in $$new_props) $$invalidate(8, icon = $$new_props.icon);
    		if ('iconPack' in $$new_props) $$invalidate(9, iconPack = $$new_props.iconPack);
    		if ('disabled' in $$new_props) $$invalidate(10, disabled = $$new_props.disabled);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onMount,
    		getContext,
    		tick,
    		omit,
    		getEventsAction,
    		current_component,
    		Icon: Icon$1,
    		value,
    		type,
    		size,
    		expanded,
    		passwordReveal,
    		maxlength,
    		hasCounter,
    		loading,
    		icon,
    		iconPack,
    		disabled,
    		input,
    		isFocused,
    		isPasswordVisible,
    		newType,
    		statusType,
    		statusTypeIcon,
    		valueLength,
    		dispatch,
    		getType,
    		togglePasswordVisibility,
    		onInput,
    		onFocus,
    		onBlur,
    		events,
    		passwordVisibleIcon,
    		hasIconRight,
    		hasIconLeft,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(26, $$props = assign(assign({}, $$props), $$new_props));
    		if ('value' in $$props) $$invalidate(0, value = $$new_props.value);
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    		if ('size' in $$props) $$invalidate(2, size = $$new_props.size);
    		if ('expanded' in $$props) $$invalidate(3, expanded = $$new_props.expanded);
    		if ('passwordReveal' in $$props) $$invalidate(4, passwordReveal = $$new_props.passwordReveal);
    		if ('maxlength' in $$props) $$invalidate(5, maxlength = $$new_props.maxlength);
    		if ('hasCounter' in $$props) $$invalidate(6, hasCounter = $$new_props.hasCounter);
    		if ('loading' in $$props) $$invalidate(7, loading = $$new_props.loading);
    		if ('icon' in $$props) $$invalidate(8, icon = $$new_props.icon);
    		if ('iconPack' in $$props) $$invalidate(9, iconPack = $$new_props.iconPack);
    		if ('disabled' in $$props) $$invalidate(10, disabled = $$new_props.disabled);
    		if ('input' in $$props) $$invalidate(12, input = $$new_props.input);
    		if ('isFocused' in $$props) $$invalidate(13, isFocused = $$new_props.isFocused);
    		if ('isPasswordVisible' in $$props) $$invalidate(27, isPasswordVisible = $$new_props.isPasswordVisible);
    		if ('newType' in $$props) $$invalidate(14, newType = $$new_props.newType);
    		if ('statusType' in $$props) $$invalidate(11, statusType = $$new_props.statusType);
    		if ('statusTypeIcon' in $$props) $$invalidate(15, statusTypeIcon = $$new_props.statusTypeIcon);
    		if ('valueLength' in $$props) $$invalidate(16, valueLength = $$new_props.valueLength);
    		if ('passwordVisibleIcon' in $$props) $$invalidate(17, passwordVisibleIcon = $$new_props.passwordVisibleIcon);
    		if ('hasIconRight' in $$props) $$invalidate(18, hasIconRight = $$new_props.hasIconRight);
    		if ('hasIconLeft' in $$props) $$invalidate(19, hasIconLeft = $$new_props.hasIconLeft);
    		if ('props' in $$props) $$invalidate(20, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(20, props = {
    			...omit($$props, 'class', 'value', 'type', 'size', 'passwordReveal', 'hasCounter', 'loading', 'disabled')
    		});

    		if ($$self.$$.dirty[0] & /*icon*/ 256) {
    			$$invalidate(19, hasIconLeft = !!icon);
    		}

    		if ($$self.$$.dirty[0] & /*passwordReveal, loading, statusType*/ 2192) {
    			$$invalidate(18, hasIconRight = passwordReveal || loading || statusType);
    		}

    		if ($$self.$$.dirty[0] & /*isPasswordVisible*/ 134217728) {
    			$$invalidate(17, passwordVisibleIcon = isPasswordVisible ? 'eye-slash' : 'eye');
    		}

    		if ($$self.$$.dirty[0] & /*statusType*/ 2048) {
    			{
    				switch (statusType) {
    					case 'is-success':
    						$$invalidate(15, statusTypeIcon = 'check');
    						break;
    					case 'is-danger':
    						$$invalidate(15, statusTypeIcon = 'exclamation-circle');
    						break;
    					case 'is-info':
    						$$invalidate(15, statusTypeIcon = 'info-circle');
    						break;
    					case 'is-warning':
    						$$invalidate(15, statusTypeIcon = 'exclamation-triangle');
    						break;
    				}
    			}
    		}

    		if ($$self.$$.dirty[0] & /*value*/ 1) {
    			{
    				if (typeof value === 'string') {
    					$$invalidate(16, valueLength = value.length);
    				} else if (typeof value === 'number') {
    					$$invalidate(16, valueLength = value.toString().length);
    				} else {
    					$$invalidate(16, valueLength = 0);
    				}
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		value,
    		type,
    		size,
    		expanded,
    		passwordReveal,
    		maxlength,
    		hasCounter,
    		loading,
    		icon,
    		iconPack,
    		disabled,
    		statusType,
    		input,
    		isFocused,
    		newType,
    		statusTypeIcon,
    		valueLength,
    		passwordVisibleIcon,
    		hasIconRight,
    		hasIconLeft,
    		props,
    		togglePasswordVisibility,
    		onInput,
    		onFocus,
    		onBlur,
    		events,
    		$$props,
    		isPasswordVisible,
    		change_handler,
    		change_handler_1,
    		input_1_binding,
    		textarea_binding
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$j,
    			create_fragment$j,
    			safe_not_equal,
    			{
    				value: 0,
    				type: 1,
    				size: 2,
    				expanded: 3,
    				passwordReveal: 4,
    				maxlength: 5,
    				hasCounter: 6,
    				loading: 7,
    				icon: 8,
    				iconPack: 9,
    				disabled: 10
    			},
    			null,
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get value() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set value(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get expanded() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set expanded(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get passwordReveal() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set passwordReveal(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get maxlength() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set maxlength(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get hasCounter() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set hasCounter(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get loading() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set loading(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconPack() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconPack(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get disabled() {
    		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set disabled(value) {
    		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$h = "";
    styleInject(css_248z$h);

    /* node_modules\svelma\src\components\Modal\Modal.svelte generated by Svelte v3.46.2 */
    const file$g = "node_modules\\svelma\\src\\components\\Modal\\Modal.svelte";

    // (44:2) {#if showClose}
    function create_if_block$5(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "modal-close is-large");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$g, 44, 4, 990);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(44:2) {#if showClose}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let div1_transition;
    	let t1;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);
    	let if_block = /*showClose*/ ctx[3] && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$g, 39, 2, 785);
    			attr_dev(div1, "class", "modal-content");
    			add_location(div1, file$g, 40, 2, 841);
    			attr_dev(div2, "class", div2_class_value = "modal " + /*size*/ ctx[2]);
    			toggle_class(div2, "is-active", /*active*/ ctx[0]);
    			add_location(div2, file$g, 38, 0, 713);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			append_dev(div2, t1);
    			if (if_block) if_block.m(div2, null);
    			/*div2_binding*/ ctx[12](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown*/ ctx[7], false, false, false),
    					listen_dev(div0, "click", /*close*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (/*showClose*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(div2, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (!current || dirty & /*size*/ 4 && div2_class_value !== (div2_class_value = "modal " + /*size*/ ctx[2])) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*size, active*/ 5) {
    				toggle_class(div2, "is-active", /*active*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*_animation*/ ctx[5], /*animProps*/ ctx[1], true);
    					div1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);

    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*_animation*/ ctx[5], /*animProps*/ ctx[1], false);
    				div1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			if (if_block) if_block.d();
    			/*div2_binding*/ ctx[12](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let _animation;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Modal', slots, ['default']);
    	let { active = true } = $$props;
    	let { animation = 'scale' } = $$props;
    	let { animProps = { start: 1.2 } } = $$props;
    	let { size = '' } = $$props;
    	let { showClose = true } = $$props;
    	let { onBody = true } = $$props;
    	let modal;

    	onMount(() => {
    		
    	});

    	function close() {
    		$$invalidate(0, active = false);
    	}

    	function keydown(e) {
    		if (active && isEscKey(e)) {
    			close();
    		}
    	}

    	const writable_props = ['active', 'animation', 'animProps', 'size', 'showClose', 'onBody'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Modal> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(4, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('animation' in $$props) $$invalidate(8, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(1, animProps = $$props.animProps);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('showClose' in $$props) $$invalidate(3, showClose = $$props.showClose);
    		if ('onBody' in $$props) $$invalidate(9, onBody = $$props.onBody);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		chooseAnimation,
    		isEscKey,
    		active,
    		animation,
    		animProps,
    		size,
    		showClose,
    		onBody,
    		modal,
    		close,
    		keydown,
    		_animation
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('animation' in $$props) $$invalidate(8, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(1, animProps = $$props.animProps);
    		if ('size' in $$props) $$invalidate(2, size = $$props.size);
    		if ('showClose' in $$props) $$invalidate(3, showClose = $$props.showClose);
    		if ('onBody' in $$props) $$invalidate(9, onBody = $$props.onBody);
    		if ('modal' in $$props) $$invalidate(4, modal = $$props.modal);
    		if ('_animation' in $$props) $$invalidate(5, _animation = $$props._animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*animation*/ 256) {
    			$$invalidate(5, _animation = chooseAnimation(animation));
    		}

    		if ($$self.$$.dirty & /*modal, active, onBody*/ 529) {
    			{
    				if (modal && active && onBody) {
    					// modal.parentNode?.removeChild(modal)
    					document.body.appendChild(modal);
    				}
    			}
    		}
    	};

    	return [
    		active,
    		animProps,
    		size,
    		showClose,
    		modal,
    		_animation,
    		close,
    		keydown,
    		animation,
    		onBody,
    		$$scope,
    		slots,
    		div2_binding
    	];
    }

    class Modal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$i, create_fragment$i, safe_not_equal, {
    			active: 0,
    			animation: 8,
    			animProps: 1,
    			size: 2,
    			showClose: 3,
    			onBody: 9
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Modal",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get active() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animProps() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animProps(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClose() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClose(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onBody() {
    		throw new Error("<Modal>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onBody(value) {
    		throw new Error("<Modal>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules\svelma\src\components\Modal\ModalCard.svelte generated by Svelte v3.46.2 */
    const file$f = "node_modules\\svelma\\src\\components\\Modal\\ModalCard.svelte";

    function create_fragment$h(ctx) {
    	let div2;
    	let div0;
    	let t0;
    	let div1;
    	let header;
    	let p;
    	let t1;
    	let t2;
    	let button0;
    	let t3;
    	let section;
    	let t4;
    	let footer;
    	let button1;
    	let t6;
    	let button2;
    	let div1_transition;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[12].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[11], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			t0 = space();
    			div1 = element("div");
    			header = element("header");
    			p = element("p");
    			t1 = text(/*title*/ ctx[1]);
    			t2 = space();
    			button0 = element("button");
    			t3 = space();
    			section = element("section");
    			if (default_slot) default_slot.c();
    			t4 = space();
    			footer = element("footer");
    			button1 = element("button");
    			button1.textContent = "Save changes";
    			t6 = space();
    			button2 = element("button");
    			button2.textContent = "Cancel";
    			attr_dev(div0, "class", "modal-background");
    			add_location(div0, file$f, 37, 2, 753);
    			attr_dev(p, "class", "modal-card-title");
    			add_location(p, file$f, 40, 6, 917);
    			attr_dev(button0, "class", "delete");
    			attr_dev(button0, "aria-label", "close");
    			add_location(button0, file$f, 41, 6, 963);
    			attr_dev(header, "class", "modal-card-head");
    			add_location(header, file$f, 39, 4, 878);
    			attr_dev(section, "class", "modal-card-body");
    			add_location(section, file$f, 43, 4, 1043);
    			attr_dev(button1, "class", "button is-success");
    			add_location(button1, file$f, 47, 6, 1150);
    			attr_dev(button2, "class", "button");
    			add_location(button2, file$f, 48, 6, 1212);
    			attr_dev(footer, "class", "modal-card-foot");
    			add_location(footer, file$f, 46, 4, 1111);
    			attr_dev(div1, "class", "modal-card");
    			add_location(div1, file$f, 38, 2, 809);
    			attr_dev(div2, "class", div2_class_value = "modal " + /*size*/ ctx[3]);
    			toggle_class(div2, "is-active", /*active*/ ctx[0]);
    			add_location(div2, file$f, 36, 0, 680);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, header);
    			append_dev(header, p);
    			append_dev(p, t1);
    			append_dev(header, t2);
    			append_dev(header, button0);
    			append_dev(div1, t3);
    			append_dev(div1, section);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			append_dev(div1, t4);
    			append_dev(div1, footer);
    			append_dev(footer, button1);
    			append_dev(footer, t6);
    			append_dev(footer, button2);
    			/*div2_binding*/ ctx[13](div2);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(window, "keydown", /*keydown*/ ctx[7], false, false, false),
    					listen_dev(div0, "click", /*close*/ ctx[6], false, false, false),
    					listen_dev(button0, "click", /*close*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (!current || dirty & /*title*/ 2) set_data_dev(t1, /*title*/ ctx[1]);

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 2048)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[11],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[11])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[11], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*size*/ 8 && div2_class_value !== (div2_class_value = "modal " + /*size*/ ctx[3])) {
    				attr_dev(div2, "class", div2_class_value);
    			}

    			if (dirty & /*size, active*/ 9) {
    				toggle_class(div2, "is-active", /*active*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*_animation*/ ctx[5], /*animProps*/ ctx[2], true);
    					div1_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);

    			if (local) {
    				if (!div1_transition) div1_transition = create_bidirectional_transition(div1, /*_animation*/ ctx[5], /*animProps*/ ctx[2], false);
    				div1_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && div1_transition) div1_transition.end();
    			/*div2_binding*/ ctx[13](null);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$h($$self, $$props, $$invalidate) {
    	let _animation;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ModalCard', slots, ['default']);
    	let { active = true } = $$props;
    	let { title = "Modal Title" } = $$props;
    	let { animation = 'scale' } = $$props;
    	let { animProps = { start: 1.2 } } = $$props;
    	let { size = '' } = $$props;
    	let { showClose = true } = $$props;
    	let { onBody = true } = $$props;
    	let modal;

    	onMount(() => {
    		
    	});

    	function close() {
    		$$invalidate(0, active = false);
    	}

    	function keydown(e) {
    		if (active && isEscKey(e)) {
    			close();
    		}
    	}

    	const writable_props = ['active', 'title', 'animation', 'animProps', 'size', 'showClose', 'onBody'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ModalCard> was created with unknown prop '${key}'`);
    	});

    	function div2_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			modal = $$value;
    			$$invalidate(4, modal);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('animation' in $$props) $$invalidate(8, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(2, animProps = $$props.animProps);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('showClose' in $$props) $$invalidate(9, showClose = $$props.showClose);
    		if ('onBody' in $$props) $$invalidate(10, onBody = $$props.onBody);
    		if ('$$scope' in $$props) $$invalidate(11, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onDestroy,
    		onMount,
    		chooseAnimation,
    		isEscKey,
    		active,
    		title,
    		animation,
    		animProps,
    		size,
    		showClose,
    		onBody,
    		modal,
    		close,
    		keydown,
    		_animation
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('title' in $$props) $$invalidate(1, title = $$props.title);
    		if ('animation' in $$props) $$invalidate(8, animation = $$props.animation);
    		if ('animProps' in $$props) $$invalidate(2, animProps = $$props.animProps);
    		if ('size' in $$props) $$invalidate(3, size = $$props.size);
    		if ('showClose' in $$props) $$invalidate(9, showClose = $$props.showClose);
    		if ('onBody' in $$props) $$invalidate(10, onBody = $$props.onBody);
    		if ('modal' in $$props) $$invalidate(4, modal = $$props.modal);
    		if ('_animation' in $$props) $$invalidate(5, _animation = $$props._animation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*animation*/ 256) {
    			$$invalidate(5, _animation = chooseAnimation(animation));
    		}

    		if ($$self.$$.dirty & /*modal, active, onBody*/ 1041) {
    			{
    				if (modal && active && onBody) {
    					document.body.appendChild(modal);
    				}
    			}
    		}
    	};

    	return [
    		active,
    		title,
    		animProps,
    		size,
    		modal,
    		_animation,
    		close,
    		keydown,
    		animation,
    		showClose,
    		onBody,
    		$$scope,
    		slots,
    		div2_binding
    	];
    }

    class ModalCard extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$h, create_fragment$h, safe_not_equal, {
    			active: 0,
    			title: 1,
    			animation: 8,
    			animProps: 2,
    			size: 3,
    			showClose: 9,
    			onBody: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ModalCard",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get active() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get title() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set title(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animation() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animation(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get animProps() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set animProps(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClose() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClose(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onBody() {
    		throw new Error("<ModalCard>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onBody(value) {
    		throw new Error("<ModalCard>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    Modal.open = open;
    ModalCard.open = open;

    function open(props) {
      const modal = new Modal({
        target: document.body,
        props,
        intro: true
      });

      modal.close = () => modal.$destroy();

      return modal;
    }

    var css_248z$g = "";
    styleInject(css_248z$g);

    /* node_modules\svelma\src\components\Notices.svelte generated by Svelte v3.46.2 */

    const file$e = "node_modules\\svelma\\src\\components\\Notices.svelte";

    function create_fragment$g(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", div_class_value = "notices " + /*positionClass*/ ctx[1] + " svelte-gicv46");
    			add_location(div, file$e, 39, 0, 884);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			/*div_binding*/ ctx[4](div);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*positionClass*/ 2 && div_class_value !== (div_class_value = "notices " + /*positionClass*/ ctx[1] + " svelte-gicv46")) {
    				attr_dev(div, "class", div_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			/*div_binding*/ ctx[4](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const notices = {};

    function instance$g($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notices', slots, []);
    	let { position = 'top' } = $$props;
    	let container;
    	let positionClass;

    	function insert(el) {
    		container.insertAdjacentElement('afterbegin', el);
    	}

    	const writable_props = ['position'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notices> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			container = $$value;
    			$$invalidate(0, container);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    	};

    	$$self.$capture_state = () => ({
    		notices,
    		position,
    		container,
    		positionClass,
    		insert
    	});

    	$$self.$inject_state = $$props => {
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    		if ('container' in $$props) $$invalidate(0, container = $$props.container);
    		if ('positionClass' in $$props) $$invalidate(1, positionClass = $$props.positionClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*position*/ 4) {
    			$$invalidate(1, positionClass = position === 'top' ? 'is-top' : 'is-bottom');
    		}
    	};

    	return [container, positionClass, position, insert, div_binding];
    }

    class Notices extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$g, create_fragment$g, safe_not_equal, { position: 2, insert: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notices",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get position() {
    		throw new Error("<Notices>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Notices>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get insert() {
    		return this.$$.ctx[3];
    	}

    	set insert(value) {
    		throw new Error("<Notices>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$f = "";
    styleInject(css_248z$f);

    /* node_modules\svelma\src\components\Notice.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1$1 } = globals;
    const file$d = "node_modules\\svelma\\src\\components\\Notice.svelte";

    // (96:0) {#if active}
    function create_if_block$4(ctx) {
    	let div;
    	let div_class_value;
    	let div_aria_hidden_value;
    	let div_intro;
    	let div_outro;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "notice " + /*position*/ ctx[1] + " svelte-x3pnf9");
    			attr_dev(div, "aria-hidden", div_aria_hidden_value = !/*active*/ ctx[0]);
    			add_location(div, file$d, 96, 2, 1946);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[10](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "outroend", /*remove*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*position*/ 2 && div_class_value !== (div_class_value = "notice " + /*position*/ ctx[1] + " svelte-x3pnf9")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*active*/ 1 && div_aria_hidden_value !== (div_aria_hidden_value = !/*active*/ ctx[0])) {
    				attr_dev(div, "aria-hidden", div_aria_hidden_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				div_intro = create_in_transition(div, fly, { y: /*transitionY*/ ctx[4] });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			if (div_intro) div_intro.invalidate();

    			div_outro = create_out_transition(div, fade, {
    				duration: /*transitionOut*/ ctx[2] ? 400 : 0
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[10](null);
    			if (detaching && div_outro) div_outro.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(96:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$f(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[0] && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$4(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const allowedProps = ['active', 'position', 'duration'];

    function filterProps(props) {
    	const newProps = {};

    	Object.keys(props).forEach(key => {
    		if (allowedProps.includes(key)) newProps[key] = props[key];
    	});

    	return newProps;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let transitionY;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notice', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { active = true } = $$props;
    	let { position = 'is-top' } = $$props;
    	let { duration = 2000 } = $$props;
    	let { transitionOut = true } = $$props;
    	let el;
    	let parent;
    	let timer;

    	function close() {
    		$$invalidate(0, active = false);
    	}

    	function remove() {
    		clearTimeout(timer);

    		// Just making sure
    		$$invalidate(0, active = false);

    		dispatch('destroyed');
    	}

    	async function setupContainers() {
    		await tick;

    		if (!notices.top) {
    			notices.top = new Notices({
    					target: document.body,
    					props: { position: 'top' }
    				});
    		}

    		if (!notices.bottom) {
    			notices.bottom = new Notices({
    					target: document.body,
    					props: { position: 'bottom' }
    				});
    		}
    	}

    	function chooseParent() {
    		parent = notices.top;
    		if (position && position.indexOf('is-bottom') === 0) parent = notices.bottom;
    		parent.insert(el);
    	}

    	onMount(async () => {
    		await setupContainers();
    		chooseParent();

    		timer = setTimeout(
    			() => {
    				close();
    			},
    			duration
    		);
    	});

    	const writable_props = ['active', 'position', 'duration', 'transitionOut'];

    	Object_1$1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notice> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(3, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('duration' in $$props) $$invalidate(6, duration = $$props.duration);
    		if ('transitionOut' in $$props) $$invalidate(2, transitionOut = $$props.transitionOut);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		allowedProps,
    		filterProps,
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		tick,
    		fly,
    		fade,
    		Notices,
    		notices,
    		dispatch,
    		active,
    		position,
    		duration,
    		transitionOut,
    		el,
    		parent,
    		timer,
    		close,
    		remove,
    		setupContainers,
    		chooseParent,
    		transitionY
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('position' in $$props) $$invalidate(1, position = $$props.position);
    		if ('duration' in $$props) $$invalidate(6, duration = $$props.duration);
    		if ('transitionOut' in $$props) $$invalidate(2, transitionOut = $$props.transitionOut);
    		if ('el' in $$props) $$invalidate(3, el = $$props.el);
    		if ('parent' in $$props) parent = $$props.parent;
    		if ('timer' in $$props) timer = $$props.timer;
    		if ('transitionY' in $$props) $$invalidate(4, transitionY = $$props.transitionY);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*position*/ 2) {
    			$$invalidate(4, transitionY = ~position.indexOf('is-top') ? -200 : 200);
    		}
    	};

    	return [
    		active,
    		position,
    		transitionOut,
    		el,
    		transitionY,
    		remove,
    		duration,
    		close,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Notice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$f, create_fragment$f, safe_not_equal, {
    			active: 0,
    			position: 1,
    			duration: 6,
    			transitionOut: 2,
    			close: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notice",
    			options,
    			id: create_fragment$f.name
    		});
    	}

    	get active() {
    		throw new Error("<Notice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Notice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Notice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Notice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Notice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Notice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get transitionOut() {
    		throw new Error("<Notice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set transitionOut(value) {
    		throw new Error("<Notice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get close() {
    		return this.$$.ctx[7];
    	}

    	set close(value) {
    		throw new Error("<Notice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$e = "";
    styleInject(css_248z$e);

    /* node_modules\svelma\src\components\Notification\Notification.svelte generated by Svelte v3.46.2 */
    const file$c = "node_modules\\svelma\\src\\components\\Notification\\Notification.svelte";

    // (92:0) {#if active}
    function create_if_block$3(ctx) {
    	let article;
    	let t0;
    	let div1;
    	let t1;
    	let div0;
    	let article_class_value;
    	let article_transition;
    	let current;
    	let if_block0 = /*showClose*/ ctx[2] && create_if_block_2(ctx);
    	let if_block1 = /*icon*/ ctx[3] && create_if_block_1(ctx);
    	const default_slot_template = /*#slots*/ ctx[11].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[10], null);

    	const block = {
    		c: function create() {
    			article = element("article");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			div0 = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div0, "class", "media-content");
    			add_location(div0, file$c, 102, 6, 2847);
    			attr_dev(div1, "class", "media svelte-1j2lhcz");
    			add_location(div1, file$c, 96, 4, 2678);
    			attr_dev(article, "class", article_class_value = "notification " + /*type*/ ctx[1] + " svelte-1j2lhcz");
    			add_location(article, file$c, 92, 2, 2507);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, article, anchor);
    			if (if_block0) if_block0.m(article, null);
    			append_dev(article, t0);
    			append_dev(article, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, div0);

    			if (default_slot) {
    				default_slot.m(div0, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*showClose*/ ctx[2]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_2(ctx);
    					if_block0.c();
    					if_block0.m(article, t0);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*icon*/ ctx[3]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*icon*/ 8) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 1024)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[10],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[10])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[10], dirty, null),
    						null
    					);
    				}
    			}

    			if (!current || dirty & /*type*/ 2 && article_class_value !== (article_class_value = "notification " + /*type*/ ctx[1] + " svelte-1j2lhcz")) {
    				attr_dev(article, "class", article_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block1);
    			transition_in(default_slot, local);

    			if (local) {
    				add_render_callback(() => {
    					if (!article_transition) article_transition = create_bidirectional_transition(article, fade, {}, true);
    					article_transition.run(1);
    				});
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block1);
    			transition_out(default_slot, local);

    			if (local) {
    				if (!article_transition) article_transition = create_bidirectional_transition(article, fade, {}, false);
    				article_transition.run(0);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(article);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (default_slot) default_slot.d(detaching);
    			if (detaching && article_transition) article_transition.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(92:0) {#if active}",
    		ctx
    	});

    	return block;
    }

    // (94:4) {#if showClose}
    function create_if_block_2(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			attr_dev(button, "class", "delete");
    			attr_dev(button, "aria-label", /*ariaCloseLabel*/ ctx[5]);
    			add_location(button, file$c, 94, 6, 2593);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*close*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*ariaCloseLabel*/ 32) {
    				attr_dev(button, "aria-label", /*ariaCloseLabel*/ ctx[5]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(94:4) {#if showClose}",
    		ctx
    	});

    	return block;
    }

    // (98:6) {#if icon}
    function create_if_block_1(ctx) {
    	let div;
    	let icon_1;
    	let current;

    	icon_1 = new Icon$1({
    			props: {
    				pack: /*iconPack*/ ctx[4],
    				icon: /*newIcon*/ ctx[6],
    				size: "is-large"
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(icon_1.$$.fragment);
    			attr_dev(div, "class", "media-left");
    			add_location(div, file$c, 98, 8, 2723);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(icon_1, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_1_changes = {};
    			if (dirty & /*iconPack*/ 16) icon_1_changes.pack = /*iconPack*/ ctx[4];
    			if (dirty & /*newIcon*/ 64) icon_1_changes.icon = /*newIcon*/ ctx[6];
    			icon_1.$set(icon_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(icon_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(98:6) {#if icon}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$e(ctx) {
    	let if_block_anchor;
    	let current;
    	let if_block = /*active*/ ctx[0] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*active*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*active*/ 1) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Notification', slots, ['default']);
    	let { type = '' } = $$props;
    	let { active = true } = $$props;
    	let { showClose = true } = $$props;
    	let { autoClose = false } = $$props;
    	let { duration = 2000 } = $$props;
    	let { icon = '' } = $$props;
    	let { iconPack = '' } = $$props;
    	let { ariaCloseLabel = '' } = $$props;

    	/** Text for notification, when used programmatically
     * @svelte-prop {String} message
     * */
    	/** Where the notification will show on the screen when used programmatically
     * @svelte-prop {String} [position=is-top-right]
     * @values <code>is-top</code>, <code>is-bottom</code>, <code>is-top-left</code>, <code>is-top-right</code>, <code>is-bottom-left</code>, <code>is-bottom-right</code>
     * */
    	const dispatch = createEventDispatcher();

    	let newIcon = '';
    	let timer;

    	function close() {
    		$$invalidate(0, active = false);
    		if (timer) clearTimeout(timer);
    		dispatch('close', active);
    	}

    	const writable_props = [
    		'type',
    		'active',
    		'showClose',
    		'autoClose',
    		'duration',
    		'icon',
    		'iconPack',
    		'ariaCloseLabel'
    	];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Notification> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('showClose' in $$props) $$invalidate(2, showClose = $$props.showClose);
    		if ('autoClose' in $$props) $$invalidate(8, autoClose = $$props.autoClose);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(4, iconPack = $$props.iconPack);
    		if ('ariaCloseLabel' in $$props) $$invalidate(5, ariaCloseLabel = $$props.ariaCloseLabel);
    		if ('$$scope' in $$props) $$invalidate(10, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fly,
    		fade,
    		Icon: Icon$1,
    		Notice,
    		filterProps,
    		typeToIcon,
    		type,
    		active,
    		showClose,
    		autoClose,
    		duration,
    		icon,
    		iconPack,
    		ariaCloseLabel,
    		dispatch,
    		newIcon,
    		timer,
    		close
    	});

    	$$self.$inject_state = $$props => {
    		if ('type' in $$props) $$invalidate(1, type = $$props.type);
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('showClose' in $$props) $$invalidate(2, showClose = $$props.showClose);
    		if ('autoClose' in $$props) $$invalidate(8, autoClose = $$props.autoClose);
    		if ('duration' in $$props) $$invalidate(9, duration = $$props.duration);
    		if ('icon' in $$props) $$invalidate(3, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(4, iconPack = $$props.iconPack);
    		if ('ariaCloseLabel' in $$props) $$invalidate(5, ariaCloseLabel = $$props.ariaCloseLabel);
    		if ('newIcon' in $$props) $$invalidate(6, newIcon = $$props.newIcon);
    		if ('timer' in $$props) timer = $$props.timer;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*icon, type*/ 10) {
    			{
    				if (icon === true) {
    					$$invalidate(6, newIcon = typeToIcon(type));
    				} else {
    					$$invalidate(6, newIcon = icon);
    				}
    			}
    		}

    		if ($$self.$$.dirty & /*active, autoClose, duration*/ 769) {
    			{
    				if (active && autoClose) {
    					timer = setTimeout(
    						() => {
    							if (active) close();
    						},
    						duration
    					);
    				}
    			}
    		}
    	};

    	return [
    		active,
    		type,
    		showClose,
    		icon,
    		iconPack,
    		ariaCloseLabel,
    		newIcon,
    		close,
    		autoClose,
    		duration,
    		$$scope,
    		slots
    	];
    }

    class Notification extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$e, create_fragment$e, safe_not_equal, {
    			type: 1,
    			active: 0,
    			showClose: 2,
    			autoClose: 8,
    			duration: 9,
    			icon: 3,
    			iconPack: 4,
    			ariaCloseLabel: 5
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Notification",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get type() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get active() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showClose() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showClose(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get autoClose() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoClose(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconPack() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconPack(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get ariaCloseLabel() {
    		throw new Error("<Notification>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set ariaCloseLabel(value) {
    		throw new Error("<Notification>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$d = "";
    styleInject(css_248z$d);

    /* node_modules\svelma\src\components\Notification\NotificationNotice.svelte generated by Svelte v3.46.2 */

    // (34:2) <Notification {...notificationProps}>
    function create_default_slot_1$1(ctx) {
    	let html_tag;
    	let html_anchor;

    	const block = {
    		c: function create() {
    			html_tag = new HtmlTag();
    			html_anchor = empty();
    			html_tag.a = html_anchor;
    		},
    		m: function mount(target, anchor) {
    			html_tag.m(/*message*/ ctx[0], target, anchor);
    			insert_dev(target, html_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) html_tag.p(/*message*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(html_anchor);
    			if (detaching) html_tag.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(34:2) <Notification {...notificationProps}>",
    		ctx
    	});

    	return block;
    }

    // (33:0) <Notice {...props} transitionOut={true}>
    function create_default_slot$5(ctx) {
    	let notification;
    	let current;
    	const notification_spread_levels = [/*notificationProps*/ ctx[1]];

    	let notification_props = {
    		$$slots: { default: [create_default_slot_1$1] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notification_spread_levels.length; i += 1) {
    		notification_props = assign(notification_props, notification_spread_levels[i]);
    	}

    	notification = new Notification({
    			props: notification_props,
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(notification.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(notification, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const notification_changes = (dirty & /*notificationProps*/ 2)
    			? get_spread_update(notification_spread_levels, [get_spread_object(/*notificationProps*/ ctx[1])])
    			: {};

    			if (dirty & /*$$scope, message*/ 129) {
    				notification_changes.$$scope = { dirty, ctx };
    			}

    			notification.$set(notification_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notification.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notification.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notification, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(33:0) <Notice {...props} transitionOut={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let notice;
    	let current;
    	const notice_spread_levels = [/*props*/ ctx[2], { transitionOut: true }];

    	let notice_props = {
    		$$slots: { default: [create_default_slot$5] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notice_spread_levels.length; i += 1) {
    		notice_props = assign(notice_props, notice_spread_levels[i]);
    	}

    	notice = new Notice({ props: notice_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(notice.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notice, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const notice_changes = (dirty & /*props*/ 4)
    			? get_spread_update(notice_spread_levels, [get_spread_object(/*props*/ ctx[2]), notice_spread_levels[1]])
    			: {};

    			if (dirty & /*$$scope, notificationProps, message*/ 131) {
    				notice_changes.$$scope = { dirty, ctx };
    			}

    			notice.$set(notice_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notice.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notice.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notice, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let props;
    	let notificationProps;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('NotificationNotice', slots, []);
    	let { message } = $$props;
    	let { duration = 2000 } = $$props;
    	let { position = 'is-top-right' } = $$props;

    	function removeNonNoficationProps(props) {
    		const newProps = {};
    		const blacklist = ['duration', 'message', 'position'];

    		Object.keys(props).forEach(key => {
    			if (!blacklist.includes(key)) newProps[key] = props[key];
    		});

    		return newProps;
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('message' in $$new_props) $$invalidate(0, message = $$new_props.message);
    		if ('duration' in $$new_props) $$invalidate(3, duration = $$new_props.duration);
    		if ('position' in $$new_props) $$invalidate(4, position = $$new_props.position);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fly,
    		fade,
    		Notice,
    		filterProps,
    		Notification,
    		message,
    		duration,
    		position,
    		removeNonNoficationProps,
    		notificationProps,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(6, $$props = assign(assign({}, $$props), $$new_props));
    		if ('message' in $$props) $$invalidate(0, message = $$new_props.message);
    		if ('duration' in $$props) $$invalidate(3, duration = $$new_props.duration);
    		if ('position' in $$props) $$invalidate(4, position = $$new_props.position);
    		if ('notificationProps' in $$props) $$invalidate(1, notificationProps = $$new_props.notificationProps);
    		if ('props' in $$props) $$invalidate(2, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		$$invalidate(2, props = {
    			...filterProps($$props),
    			duration,
    			position
    		});

    		$$invalidate(1, notificationProps = { ...removeNonNoficationProps($$props) });
    	};

    	$$props = exclude_internal_props($$props);
    	return [message, notificationProps, props, duration, position];
    }

    class NotificationNotice extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, { message: 0, duration: 3, position: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "NotificationNotice",
    			options,
    			id: create_fragment$d.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<NotificationNotice> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<NotificationNotice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<NotificationNotice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<NotificationNotice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<NotificationNotice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<NotificationNotice>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<NotificationNotice>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    Notification.create = create$2;

    function create$2(props) {
      if (typeof props === 'string') props = { message: props };

      const notification = new NotificationNotice({
        target: document.body,
        props,
        intro: true,
      });

      notification.$on('destroyed', notification.$destroy);

      return notification
    }

    var css_248z$c = "";
    styleInject(css_248z$c);

    /* node_modules\svelma\src\components\Snackbar\Snackbar.svelte generated by Svelte v3.46.2 */

    const { Error: Error_1 } = globals;
    const file$b = "node_modules\\svelma\\src\\components\\Snackbar\\Snackbar.svelte";

    // (92:4) {#if actionText}
    function create_if_block$2(ctx) {
    	let div;
    	let button;
    	let t;
    	let button_class_value;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div = element("div");
    			button = element("button");
    			t = text(/*actionText*/ ctx[2]);
    			attr_dev(button, "class", button_class_value = "button " + /*newType*/ ctx[5] + " svelte-6ks3pf");
    			add_location(button, file$b, 93, 8, 2721);
    			attr_dev(div, "class", "action svelte-6ks3pf");
    			add_location(div, file$b, 92, 6, 2674);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, button);
    			append_dev(button, t);

    			if (!mounted) {
    				dispose = listen_dev(div, "click", /*action*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*actionText*/ 4) set_data_dev(t, /*actionText*/ ctx[2]);

    			if (dirty & /*newType*/ 32 && button_class_value !== (button_class_value = "button " + /*newType*/ ctx[5] + " svelte-6ks3pf")) {
    				attr_dev(button, "class", button_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(92:4) {#if actionText}",
    		ctx
    	});

    	return block;
    }

    // (86:0) <Notice {...props} bind:this={notice} transitionOut={true}>
    function create_default_slot$4(ctx) {
    	let div1;
    	let div0;
    	let t;
    	let div1_class_value;
    	let if_block = /*actionText*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			t = space();
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "text svelte-6ks3pf");
    			add_location(div0, file$b, 87, 4, 2515);
    			attr_dev(div1, "class", div1_class_value = "snackbar " + /*background*/ ctx[1] + " svelte-6ks3pf");
    			attr_dev(div1, "role", "alert");
    			toggle_class(div1, "has-background-dark", !/*background*/ ctx[1]);
    			add_location(div1, file$b, 86, 2, 2422);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = /*message*/ ctx[0];
    			append_dev(div1, t);
    			if (if_block) if_block.m(div1, null);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) div0.innerHTML = /*message*/ ctx[0];
    			if (/*actionText*/ ctx[2]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					if_block.m(div1, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*background*/ 2 && div1_class_value !== (div1_class_value = "snackbar " + /*background*/ ctx[1] + " svelte-6ks3pf")) {
    				attr_dev(div1, "class", div1_class_value);
    			}

    			if (dirty & /*background, background*/ 2) {
    				toggle_class(div1, "has-background-dark", !/*background*/ ctx[1]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(86:0) <Notice {...props} bind:this={notice} transitionOut={true}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let notice_1;
    	let current;
    	const notice_1_spread_levels = [/*props*/ ctx[4], { transitionOut: true }];

    	let notice_1_props = {
    		$$slots: { default: [create_default_slot$4] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notice_1_spread_levels.length; i += 1) {
    		notice_1_props = assign(notice_1_props, notice_1_spread_levels[i]);
    	}

    	notice_1 = new Notice({ props: notice_1_props, $$inline: true });
    	/*notice_1_binding*/ ctx[11](notice_1);

    	const block = {
    		c: function create() {
    			create_component(notice_1.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error_1("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notice_1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const notice_1_changes = (dirty & /*props*/ 16)
    			? get_spread_update(notice_1_spread_levels, [get_spread_object(/*props*/ ctx[4]), notice_1_spread_levels[1]])
    			: {};

    			if (dirty & /*$$scope, background, newType, actionText, message*/ 8231) {
    				notice_1_changes.$$scope = { dirty, ctx };
    			}

    			notice_1.$set(notice_1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notice_1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notice_1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			/*notice_1_binding*/ ctx[11](null);
    			destroy_component(notice_1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	let newType;
    	let props;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Snackbar', slots, []);
    	let { message } = $$props;
    	let { duration = 3500 } = $$props;
    	let { position = 'is-bottom-right' } = $$props;
    	let { type = 'is-primary' } = $$props;
    	let { background = '' } = $$props;
    	let { actionText = 'OK' } = $$props;

    	let { onAction = () => {
    		
    	} } = $$props;

    	let notice;

    	function action() {
    		Promise.resolve(onAction()).then(() => notice.close());
    	}

    	onMount(() => {
    		if (typeof onAction !== 'function') throw new Error(`onAction ${onAction} is not a function`);
    	});

    	function notice_1_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			notice = $$value;
    			$$invalidate(3, notice);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('message' in $$new_props) $$invalidate(0, message = $$new_props.message);
    		if ('duration' in $$new_props) $$invalidate(7, duration = $$new_props.duration);
    		if ('position' in $$new_props) $$invalidate(8, position = $$new_props.position);
    		if ('type' in $$new_props) $$invalidate(9, type = $$new_props.type);
    		if ('background' in $$new_props) $$invalidate(1, background = $$new_props.background);
    		if ('actionText' in $$new_props) $$invalidate(2, actionText = $$new_props.actionText);
    		if ('onAction' in $$new_props) $$invalidate(10, onAction = $$new_props.onAction);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fly,
    		fade,
    		Notice,
    		filterProps,
    		message,
    		duration,
    		position,
    		type,
    		background,
    		actionText,
    		onAction,
    		notice,
    		action,
    		props,
    		newType
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(12, $$props = assign(assign({}, $$props), $$new_props));
    		if ('message' in $$props) $$invalidate(0, message = $$new_props.message);
    		if ('duration' in $$props) $$invalidate(7, duration = $$new_props.duration);
    		if ('position' in $$props) $$invalidate(8, position = $$new_props.position);
    		if ('type' in $$props) $$invalidate(9, type = $$new_props.type);
    		if ('background' in $$props) $$invalidate(1, background = $$new_props.background);
    		if ('actionText' in $$props) $$invalidate(2, actionText = $$new_props.actionText);
    		if ('onAction' in $$props) $$invalidate(10, onAction = $$new_props.onAction);
    		if ('notice' in $$props) $$invalidate(3, notice = $$new_props.notice);
    		if ('props' in $$props) $$invalidate(4, props = $$new_props.props);
    		if ('newType' in $$props) $$invalidate(5, newType = $$new_props.newType);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*type*/ 512) {
    			// $: newBackground = background
    			$$invalidate(5, newType = type && type.replace(/^is-(.*)/, 'has-text-$1'));
    		}

    		$$invalidate(4, props = {
    			...filterProps($$props),
    			position,
    			duration
    		});
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		message,
    		background,
    		actionText,
    		notice,
    		props,
    		newType,
    		action,
    		duration,
    		position,
    		type,
    		onAction,
    		notice_1_binding
    	];
    }

    class Snackbar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$c, create_fragment$c, safe_not_equal, {
    			message: 0,
    			duration: 7,
    			position: 8,
    			type: 9,
    			background: 1,
    			actionText: 2,
    			onAction: 10
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Snackbar",
    			options,
    			id: create_fragment$c.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Snackbar> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get actionText() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set actionText(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get onAction() {
    		throw new Error_1("<Snackbar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set onAction(value) {
    		throw new Error_1("<Snackbar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    Snackbar.create = create$1;

    function create$1(props) {
      if (typeof props === 'string') props = { message: props };

      const snackbar = new Snackbar({
        target: document.body,
        props,
        intro: true,
      });

      snackbar.$on('destroyed', snackbar.$destroy);

      return snackbar;
    }

    var css_248z$b = "";
    styleInject(css_248z$b);

    var css_248z$a = "";
    styleInject(css_248z$a);

    /* node_modules\svelma\src\components\Tabs\Tabs.svelte generated by Svelte v3.46.2 */
    const file$a = "node_modules\\svelma\\src\\components\\Tabs\\Tabs.svelte";

    function get_each_context$3(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	child_ctx[16] = i;
    	return child_ctx;
    }

    // (84:12) {#if tab.icon}
    function create_if_block$1(ctx) {
    	let icon;
    	let current;

    	icon = new Icon$1({
    			props: {
    				pack: /*tab*/ ctx[14].iconPack,
    				icon: /*tab*/ ctx[14].icon
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(icon.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(icon, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*$tabs*/ 16) icon_changes.pack = /*tab*/ ctx[14].iconPack;
    			if (dirty & /*$tabs*/ 16) icon_changes.icon = /*tab*/ ctx[14].icon;
    			icon.$set(icon_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(icon, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(84:12) {#if tab.icon}",
    		ctx
    	});

    	return block;
    }

    // (81:6) {#each $tabs as tab, index}
    function create_each_block$3(ctx) {
    	let li;
    	let a;
    	let t0;
    	let span;
    	let t1_value = /*tab*/ ctx[14].label + "";
    	let t1;
    	let t2;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*tab*/ ctx[14].icon && create_if_block$1(ctx);

    	function click_handler() {
    		return /*click_handler*/ ctx[10](/*index*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			li = element("li");
    			a = element("a");
    			if (if_block) if_block.c();
    			t0 = space();
    			span = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			add_location(span, file$a, 87, 12, 2513);
    			attr_dev(a, "href", "");
    			add_location(a, file$a, 82, 10, 2340);
    			toggle_class(li, "is-active", /*index*/ ctx[16] === /*activeFinished*/ ctx[5]);
    			add_location(li, file$a, 81, 8, 2282);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, a);
    			if (if_block) if_block.m(a, null);
    			append_dev(a, t0);
    			append_dev(a, span);
    			append_dev(span, t1);
    			append_dev(li, t2);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", prevent_default(click_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (/*tab*/ ctx[14].icon) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*$tabs*/ 16) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(a, t0);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*$tabs*/ 16) && t1_value !== (t1_value = /*tab*/ ctx[14].label + "")) set_data_dev(t1, t1_value);

    			if (dirty & /*activeFinished*/ 32) {
    				toggle_class(li, "is-active", /*index*/ ctx[16] === /*activeFinished*/ ctx[5]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$3.name,
    		type: "each",
    		source: "(81:6) {#each $tabs as tab, index}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let div;
    	let nav;
    	let ul;
    	let nav_class_value;
    	let t;
    	let section;
    	let current;
    	let each_value = /*$tabs*/ ctx[4];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			div = element("div");
    			nav = element("nav");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			section = element("section");
    			if (default_slot) default_slot.c();
    			add_location(ul, file$a, 79, 4, 2235);
    			attr_dev(nav, "class", nav_class_value = "tabs " + /*size*/ ctx[1] + " " + /*position*/ ctx[2] + " " + /*style*/ ctx[3] + " svelte-4bwvg0");
    			add_location(nav, file$a, 78, 2, 2186);
    			attr_dev(section, "class", "tab-content svelte-4bwvg0");
    			add_location(section, file$a, 93, 2, 2602);
    			attr_dev(div, "class", "tabs-wrapper svelte-4bwvg0");
    			add_location(div, file$a, 77, 0, 2157);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, nav);
    			append_dev(nav, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t);
    			append_dev(div, section);

    			if (default_slot) {
    				default_slot.m(section, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*activeFinished, active, $tabs*/ 49) {
    				each_value = /*$tabs*/ ctx[4];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$3(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$3(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*size, position, style*/ 14 && nav_class_value !== (nav_class_value = "tabs " + /*size*/ ctx[1] + " " + /*position*/ ctx[2] + " " + /*style*/ ctx[3] + " svelte-4bwvg0")) {
    				attr_dev(nav, "class", nav_class_value);
    			}

    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope*/ 256)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, null),
    						null
    					);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let $tabs;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tabs', slots, ['default']);
    	const dispatch = createEventDispatcher();
    	let { active = 0 } = $$props;
    	let { size = '' } = $$props;
    	let { position = '' } = $$props;
    	let { style = '' } = $$props;
    	const setActive = index => $$invalidate(0, active = index);

    	// deferred assignment of active variable, to avoid triggering infinite reactive loop
    	// during changeActiveTab, holds previous active value
    	let activeFinished = active;

    	const tabs = writable([]);
    	validate_store(tabs, 'tabs');
    	component_subscribe($$self, tabs, value => $$invalidate(4, $tabs = value));
    	const tabConfig = { active, tabs };
    	setContext('tabs', tabConfig);

    	const changeActiveTab = newActive => {
    		// NOTE: change this back to using changeTab instead of activate/deactivate once transitions/animations are working
    		if ($tabs[activeFinished]) $tabs[activeFinished].deactivate();

    		if ($tabs[newActive]) $tabs[newActive].activate();

    		// $tabs.forEach(t => t.changeTab({ from: activeTab, to: newActive }))
    		// deferred assignment of active variable
    		$$invalidate(5, activeFinished = tabConfig.activeTab = newActive);

    		// allows using on:change on Tabs
    		// can be used when bind:active cannot be used
    		dispatch('change', activeFinished);
    	};

    	onMount(() => changeActiveTab(active));
    	const writable_props = ['active', 'size', 'position', 'style'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tabs> was created with unknown prop '${key}'`);
    	});

    	const click_handler = index => $$invalidate(0, active = index);

    	$$self.$$set = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		setContext,
    		onMount,
    		createEventDispatcher,
    		writable,
    		Icon: Icon$1,
    		dispatch,
    		active,
    		size,
    		position,
    		style,
    		setActive,
    		activeFinished,
    		tabs,
    		tabConfig,
    		changeActiveTab,
    		$tabs
    	});

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    		if ('size' in $$props) $$invalidate(1, size = $$props.size);
    		if ('position' in $$props) $$invalidate(2, position = $$props.position);
    		if ('style' in $$props) $$invalidate(3, style = $$props.style);
    		if ('activeFinished' in $$props) $$invalidate(5, activeFinished = $$props.activeFinished);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*active, $tabs*/ 17) {
    			// As tabs get deleted, keep active within bounds
    			if (active < 0 || active >= $tabs.length) $$invalidate(0, active = $tabs.length - 1);
    		}

    		if ($$self.$$.dirty & /*active*/ 1) {
    			changeActiveTab(active);
    		}
    	};

    	return [
    		active,
    		size,
    		position,
    		style,
    		$tabs,
    		activeFinished,
    		tabs,
    		setActive,
    		$$scope,
    		slots,
    		click_handler
    	];
    }

    class Tabs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {
    			active: 0,
    			size: 1,
    			position: 2,
    			style: 3,
    			setActive: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tabs",
    			options,
    			id: create_fragment$b.name
    		});
    	}

    	get active() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set active(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get size() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set size(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get position() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set position(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get style() {
    		throw new Error("<Tabs>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get setActive() {
    		return this.$$.ctx[7];
    	}

    	set setActive(value) {
    		throw new Error("<Tabs>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$9 = "";
    styleInject(css_248z$9);

    /* node_modules\svelma\src\components\Tabs\Tab.svelte generated by Svelte v3.46.2 */
    const file$9 = "node_modules\\svelma\\src\\components\\Tabs\\Tab.svelte";

    const get_default_slot_changes = dirty => ({
    	label: dirty & /*label*/ 1,
    	iconPack: dirty & /*iconPack*/ 4,
    	icon: dirty & /*icon*/ 2
    });

    const get_default_slot_context = ctx => ({
    	label: /*label*/ ctx[0],
    	iconPack: /*iconPack*/ ctx[2],
    	icon: /*icon*/ ctx[1]
    });

    function create_fragment$a(ctx) {
    	let div;
    	let div_class_value;
    	let div_aria_hidden_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[9].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], get_default_slot_context);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (default_slot) default_slot.c();
    			attr_dev(div, "class", div_class_value = "tab " + /*direction*/ ctx[5] + " svelte-d07p7i");
    			attr_dev(div, "aria-hidden", div_aria_hidden_value = !/*active*/ ctx[3]);
    			toggle_class(div, "is-active", /*active*/ ctx[3]);
    			add_location(div, file$9, 103, 0, 2416);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (default_slot) {
    				default_slot.m(div, null);
    			}

    			/*div_binding*/ ctx[10](div);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "transitionend", /*transitionend*/ ctx[6], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && (!current || dirty & /*$$scope, label, iconPack, icon*/ 263)) {
    					update_slot_base(
    						default_slot,
    						default_slot_template,
    						ctx,
    						/*$$scope*/ ctx[8],
    						!current
    						? get_all_dirty_from_scope(/*$$scope*/ ctx[8])
    						: get_slot_changes(default_slot_template, /*$$scope*/ ctx[8], dirty, get_default_slot_changes),
    						get_default_slot_context
    					);
    				}
    			}

    			if (!current || dirty & /*direction*/ 32 && div_class_value !== (div_class_value = "tab " + /*direction*/ ctx[5] + " svelte-d07p7i")) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (!current || dirty & /*active*/ 8 && div_aria_hidden_value !== (div_aria_hidden_value = !/*active*/ ctx[3])) {
    				attr_dev(div, "aria-hidden", div_aria_hidden_value);
    			}

    			if (dirty & /*direction, active*/ 40) {
    				toggle_class(div, "is-active", /*active*/ ctx[3]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (default_slot) default_slot.d(detaching);
    			/*div_binding*/ ctx[10](null);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$a.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$a($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Tab', slots, ['default']);
    	let { label } = $$props;
    	let { icon = '' } = $$props;
    	let { iconPack = '' } = $$props;
    	let active = false;
    	let el;
    	let index;
    	let starting = false;
    	let direction = '';
    	let isIn = false;
    	const key = {};
    	const tabConfig = getContext('tabs');

    	async function changeTab({ from, to }) {
    		if (from === to) return;

    		// console.log({ index, from, to }, to === index)
    		if (from === index) {
    			// Transition out
    			$$invalidate(5, direction = index < to ? 'left' : 'right');
    		} else if (to === index) {
    			// Transition in; start at direction when rendered, then remove it
    			// console.log('TRANSITION', { index, to, active })
    			$$invalidate(3, active = true);

    			$$invalidate(5, direction = index > from ? 'right' : 'left');
    		} else // direction = ''
    		$$invalidate(5, direction = ''); // await tick()
    	}

    	function updateIndex() {
    		if (el == null || el.parentNode == null) return;
    		index = Array.prototype.indexOf.call(el.parentNode.children, el);
    	}

    	async function transitionend(event) {
    		// console.log({ index, active, active: tabConfig.active })
    		// console.log(event.target)
    		$$invalidate(3, active = index === tabConfig.active);

    		await tick();
    		$$invalidate(5, direction = '');
    	}

    	tabConfig.tabs.subscribe(tabs => {
    		updateIndex();
    	});

    	onMount(() => {
    		updateIndex();

    		tabConfig.tabs.update(tabs => [
    			...tabs,
    			{
    				key,
    				index,
    				label,
    				icon,
    				iconPack,
    				activate: () => $$invalidate(3, active = true),
    				deactivate: () => $$invalidate(3, active = false),
    				changeTab
    			}
    		]);

    		return () => tabConfig.tabs.update(tabs => tabs.filter(t => t.key !== key));
    	});

    	beforeUpdate(async () => {
    		if (index === tabConfig.active && direction) {
    			await tick();

    			setTimeout(() => {
    				$$invalidate(5, direction = '');
    			});
    		}
    	});

    	const writable_props = ['label', 'icon', 'iconPack'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Tab> was created with unknown prop '${key}'`);
    	});

    	function div_binding($$value) {
    		binding_callbacks[$$value ? 'unshift' : 'push'](() => {
    			el = $$value;
    			$$invalidate(4, el);
    		});
    	}

    	$$self.$$set = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(2, iconPack = $$props.iconPack);
    		if ('$$scope' in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		beforeUpdate,
    		getContext,
    		tick,
    		onMount,
    		label,
    		icon,
    		iconPack,
    		active,
    		el,
    		index,
    		starting,
    		direction,
    		isIn,
    		key,
    		tabConfig,
    		changeTab,
    		updateIndex,
    		transitionend
    	});

    	$$self.$inject_state = $$props => {
    		if ('label' in $$props) $$invalidate(0, label = $$props.label);
    		if ('icon' in $$props) $$invalidate(1, icon = $$props.icon);
    		if ('iconPack' in $$props) $$invalidate(2, iconPack = $$props.iconPack);
    		if ('active' in $$props) $$invalidate(3, active = $$props.active);
    		if ('el' in $$props) $$invalidate(4, el = $$props.el);
    		if ('index' in $$props) index = $$props.index;
    		if ('starting' in $$props) starting = $$props.starting;
    		if ('direction' in $$props) $$invalidate(5, direction = $$props.direction);
    		if ('isIn' in $$props) isIn = $$props.isIn;
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*label, icon, iconPack*/ 7) {
    			tabConfig.tabs.update(tabs => tabs.map(t => t.key === key ? { ...t, label, icon, iconPack } : t));
    		}
    	};

    	return [
    		label,
    		icon,
    		iconPack,
    		active,
    		el,
    		direction,
    		transitionend,
    		changeTab,
    		$$scope,
    		slots,
    		div_binding
    	];
    }

    class Tab extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$a, create_fragment$a, safe_not_equal, {
    			label: 0,
    			icon: 1,
    			iconPack: 2,
    			changeTab: 7
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tab",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*label*/ ctx[0] === undefined && !('label' in props)) {
    			console.warn("<Tab> was created without expected prop 'label'");
    		}
    	}

    	get label() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set label(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get icon() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set icon(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get iconPack() {
    		throw new Error("<Tab>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set iconPack(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get changeTab() {
    		return this.$$.ctx[7];
    	}

    	set changeTab(value) {
    		throw new Error("<Tab>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$8 = "";
    styleInject(css_248z$8);

    /* node_modules\svelma\src\components\Toast\Toast.svelte generated by Svelte v3.46.2 */
    const file$8 = "node_modules\\svelma\\src\\components\\Toast\\Toast.svelte";

    // (49:0) <Notice {...filterProps($$props)}>
    function create_default_slot$3(ctx) {
    	let div1;
    	let div0;
    	let div1_class_value;

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			attr_dev(div0, "class", "text");
    			add_location(div0, file$8, 50, 4, 1498);
    			attr_dev(div1, "class", div1_class_value = "toast " + /*type*/ ctx[1] + " " + /*newBackground*/ ctx[2] + " svelte-1ahpku3");
    			attr_dev(div1, "role", "alert");
    			add_location(div1, file$8, 49, 2, 1438);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = /*message*/ ctx[0];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*message*/ 1) div0.innerHTML = /*message*/ ctx[0];
    			if (dirty & /*type, newBackground*/ 6 && div1_class_value !== (div1_class_value = "toast " + /*type*/ ctx[1] + " " + /*newBackground*/ ctx[2] + " svelte-1ahpku3")) {
    				attr_dev(div1, "class", div1_class_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(49:0) <Notice {...filterProps($$props)}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let notice;
    	let current;
    	const notice_spread_levels = [filterProps(/*$$props*/ ctx[3])];

    	let notice_props = {
    		$$slots: { default: [create_default_slot$3] },
    		$$scope: { ctx }
    	};

    	for (let i = 0; i < notice_spread_levels.length; i += 1) {
    		notice_props = assign(notice_props, notice_spread_levels[i]);
    	}

    	notice = new Notice({ props: notice_props, $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(notice.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(notice, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const notice_changes = (dirty & /*filterProps, $$props*/ 8)
    			? get_spread_update(notice_spread_levels, [get_spread_object(filterProps(/*$$props*/ ctx[3]))])
    			: {};

    			if (dirty & /*$$scope, type, newBackground, message*/ 39) {
    				notice_changes.$$scope = { dirty, ctx };
    			}

    			notice.$set(notice_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(notice.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(notice.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(notice, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$9.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let newBackground;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Toast', slots, []);
    	let { message } = $$props;
    	let { type = 'is-dark' } = $$props;
    	let { background = '' } = $$props;

    	$$self.$$set = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ('message' in $$new_props) $$invalidate(0, message = $$new_props.message);
    		if ('type' in $$new_props) $$invalidate(1, type = $$new_props.type);
    		if ('background' in $$new_props) $$invalidate(4, background = $$new_props.background);
    	};

    	$$self.$capture_state = () => ({
    		createEventDispatcher,
    		onDestroy,
    		onMount,
    		fly,
    		fade,
    		Notice,
    		filterProps,
    		message,
    		type,
    		background,
    		newBackground
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(3, $$props = assign(assign({}, $$props), $$new_props));
    		if ('message' in $$props) $$invalidate(0, message = $$new_props.message);
    		if ('type' in $$props) $$invalidate(1, type = $$new_props.type);
    		if ('background' in $$props) $$invalidate(4, background = $$new_props.background);
    		if ('newBackground' in $$props) $$invalidate(2, newBackground = $$new_props.newBackground);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*background, type*/ 18) {
    			$$invalidate(2, newBackground = background || type.replace(/^is-(.*)/, 'has-background-$1'));
    		}
    	};

    	$$props = exclude_internal_props($$props);
    	return [message, type, newBackground, $$props, background];
    }

    class Toast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { message: 0, type: 1, background: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Toast",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*message*/ ctx[0] === undefined && !('message' in props)) {
    			console.warn("<Toast> was created without expected prop 'message'");
    		}
    	}

    	get message() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set message(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<Toast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<Toast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    Toast.create = create;

    function create(props) {
      if (typeof props === 'string') props = { message: props };

      const toast = new Toast({
        target: document.body,
        props,
        intro: true,
      });

      toast.$on('destroyed', toast.$destroy);

      return toast;
    }

    var css_248z$7 = "";
    styleInject(css_248z$7);

    var css_248z$6 = "";
    styleInject(css_248z$6);

    /* src\Icon.svelte generated by Svelte v3.46.2 */

    const file$7 = "src\\Icon.svelte";

    function create_fragment$8(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (!src_url_equal(img.src, img_src_value = /*getIconURL*/ ctx[1](/*id*/ ctx[0]))) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", /*id*/ ctx[0]);
    			attr_dev(img, "class", "svelte-z1x8ah");
    			add_location(img, file$7, 7, 0, 200);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*id*/ 1 && !src_url_equal(img.src, img_src_value = /*getIconURL*/ ctx[1](/*id*/ ctx[0]))) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (dirty & /*id*/ 1) {
    				attr_dev(img, "alt", /*id*/ ctx[0]);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$8.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const item_icons_url = "https://raw.githubusercontent.com/osrsbox/osrsbox-db/master/docs/items-icons/";

    function instance$8($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Icon', slots, []);
    	let { id } = $$props;
    	const getIconURL = id => item_icons_url + id + ".png";
    	const writable_props = ['id'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<Icon> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	$$self.$capture_state = () => ({ id, item_icons_url, getIconURL });

    	$$self.$inject_state = $$props => {
    		if ('id' in $$props) $$invalidate(0, id = $$props.id);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [id, getIconURL];
    }

    class Icon extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { id: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Icon",
    			options,
    			id: create_fragment$8.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*id*/ ctx[0] === undefined && !('id' in props)) {
    			console.warn("<Icon> was created without expected prop 'id'");
    		}
    	}

    	get id() {
    		throw new Error("<Icon>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set id(value) {
    		throw new Error("<Icon>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    // src/memoize.js
    function memoize(fn, options) {
      var cache = options && options.cache ? options.cache : cacheDefault;
      var serializer = options && options.serializer ? options.serializer : serializerDefault;
      var strategy = options && options.strategy ? options.strategy : strategyDefault;
      return strategy(fn, {
        cache,
        serializer
      });
    }
    function isPrimitive(value) {
      return value == null || typeof value === "number" || typeof value === "boolean";
    }
    function monadic(fn, cache, serializer, arg) {
      var cacheKey = isPrimitive(arg) ? arg : serializer(arg);
      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === "undefined") {
        computedValue = fn.call(this, arg);
        cache.set(cacheKey, computedValue);
      }
      return computedValue;
    }
    function variadic(fn, cache, serializer) {
      var args = Array.prototype.slice.call(arguments, 3);
      var cacheKey = serializer(args);
      var computedValue = cache.get(cacheKey);
      if (typeof computedValue === "undefined") {
        computedValue = fn.apply(this, args);
        cache.set(cacheKey, computedValue);
      }
      return computedValue;
    }
    function assemble(fn, context, strategy, cache, serialize) {
      return strategy.bind(context, fn, cache, serialize);
    }
    function strategyDefault(fn, options) {
      var strategy = fn.length === 1 ? monadic : variadic;
      return assemble(fn, this, strategy, options.cache.create(), options.serializer);
    }
    function serializerDefault() {
      return JSON.stringify(arguments);
    }
    function ObjectWithoutPrototypeCache() {
      this.cache = Object.create(null);
    }
    ObjectWithoutPrototypeCache.prototype.has = function(key) {
      return key in this.cache;
    };
    ObjectWithoutPrototypeCache.prototype.get = function(key) {
      return this.cache[key];
    };
    ObjectWithoutPrototypeCache.prototype.set = function(key, value) {
      this.cache[key] = value;
    };
    var cacheDefault = {
      create: function create() {
        return new ObjectWithoutPrototypeCache();
      }
    };
    var memoize_default = memoize;

    // src/index.ts
    var DEFAULT_CLASS = {
      MAIN: "svelte-draggable",
      DRAGGING: "svelte-draggable-dragging",
      DRAGGED: "svelte-draggable-dragged"
    };
    var draggable = (node, options = {}) => {
      let {
        bounds,
        axis = "both",
        gpuAcceleration = true,
        applyUserSelectHack = true,
        disabled = false,
        ignoreMultitouch = false,
        grid,
        position,
        cancel,
        handle,
        defaultClass = DEFAULT_CLASS.MAIN,
        defaultClassDragging = DEFAULT_CLASS.DRAGGING,
        defaultClassDragged = DEFAULT_CLASS.DRAGGED,
        defaultPosition = { x: 0, y: 0 },
        onDragStart,
        onDrag,
        onDragEnd
      } = options;
      let active = false;
      let [translateX, translateY] = [0, 0];
      let [initialX, initialY] = [0, 0];
      let [clientToNodeOffsetX, clientToNodeOffsetY] = [0, 0];
      let [xOffset, yOffset] = [defaultPosition.x, defaultPosition.y];
      setTranslate(xOffset, yOffset, node, gpuAcceleration);
      let canMoveInX;
      let canMoveInY;
      let bodyOriginalUserSelectVal = "";
      let computedBounds;
      let nodeRect;
      let dragEl;
      let cancelEl;
      let isControlled = !!position;
      function fireSvelteDragStartEvent(node2) {
        const data = { offsetX: translateX, offsetY: translateY };
        node2.dispatchEvent(new CustomEvent("svelte-drag:start", { detail: data }));
        onDragStart == null ? void 0 : onDragStart(data);
      }
      function fireSvelteDragStopEvent(node2) {
        const data = { offsetX: translateX, offsetY: translateY };
        node2.dispatchEvent(new CustomEvent("svelte-drag:end", { detail: data }));
        onDragEnd == null ? void 0 : onDragEnd(data);
      }
      function fireSvelteDragEvent(node2, translateX2, translateY2) {
        const data = { offsetX: translateX2, offsetY: translateY2 };
        node2.dispatchEvent(new CustomEvent("svelte-drag", { detail: data }));
        onDrag == null ? void 0 : onDrag(data);
      }
      const listen = addEventListener;
      listen("touchstart", dragStart, false);
      listen("touchend", dragEnd, false);
      listen("touchmove", drag, false);
      listen("mousedown", dragStart, false);
      listen("mouseup", dragEnd, false);
      listen("mousemove", drag, false);
      node.style.touchAction = "none";
      const calculateInverseScale = () => {
        let inverseScale = node.offsetWidth / nodeRect.width;
        if (isNaN(inverseScale))
          inverseScale = 1;
        return inverseScale;
      };
      function dragStart(e) {
        if (disabled)
          return;
        if (ignoreMultitouch && e.type === "touchstart" && e.touches.length > 1)
          return;
        node.classList.add(defaultClass);
        dragEl = getDragEl(handle, node);
        cancelEl = getCancelElement(cancel, node);
        canMoveInX = ["both", "x"].includes(axis);
        canMoveInY = ["both", "y"].includes(axis);
        if (typeof bounds !== "undefined")
          computedBounds = computeBoundRect(bounds, node);
        nodeRect = node.getBoundingClientRect();
        if (isString$1(handle) && isString$1(cancel) && handle === cancel)
          throw new Error("`handle` selector can't be same as `cancel` selector");
        if (cancelEl == null ? void 0 : cancelEl.contains(dragEl))
          throw new Error("Element being dragged can't be a child of the element on which `cancel` is applied");
        if (dragEl.contains(e.target) && !(cancelEl == null ? void 0 : cancelEl.contains(e.target)))
          active = true;
        if (!active)
          return;
        if (applyUserSelectHack) {
          bodyOriginalUserSelectVal = document.body.style.userSelect;
          document.body.style.userSelect = "none";
        }
        fireSvelteDragStartEvent(node);
        const { clientX, clientY } = isTouchEvent(e) ? e.touches[0] : e;
        const inverseScale = calculateInverseScale();
        if (canMoveInX)
          initialX = clientX - xOffset / inverseScale;
        if (canMoveInY)
          initialY = clientY - yOffset / inverseScale;
        if (computedBounds) {
          clientToNodeOffsetX = clientX - nodeRect.left;
          clientToNodeOffsetY = clientY - nodeRect.top;
        }
      }
      function dragEnd(e) {
        if (disabled)
          return;
        if (!active)
          return;
        node.classList.remove(defaultClassDragging);
        node.classList.add(defaultClassDragged);
        if (applyUserSelectHack)
          document.body.style.userSelect = bodyOriginalUserSelectVal;
        fireSvelteDragStopEvent(node);
        if (canMoveInX)
          initialX = translateX;
        if (canMoveInX)
          initialY = translateY;
        active = false;
      }
      function drag(e) {
        if (!active)
          return;
        node.classList.add(defaultClassDragging);
        e.preventDefault();
        nodeRect = node.getBoundingClientRect();
        const { clientX, clientY } = isTouchEvent(e) ? e.touches[0] : e;
        let [finalX, finalY] = [clientX, clientY];
        const inverseScale = calculateInverseScale();
        if (computedBounds) {
          const virtualClientBounds = {
            left: computedBounds.left + clientToNodeOffsetX,
            top: computedBounds.top + clientToNodeOffsetY,
            right: computedBounds.right + clientToNodeOffsetX - nodeRect.width,
            bottom: computedBounds.bottom + clientToNodeOffsetY - nodeRect.height
          };
          finalX = Math.min(Math.max(finalX, virtualClientBounds.left), virtualClientBounds.right);
          finalY = Math.min(Math.max(finalY, virtualClientBounds.top), virtualClientBounds.bottom);
        }
        if (Array.isArray(grid)) {
          let [xSnap, ySnap] = grid;
          if (isNaN(+xSnap) || xSnap < 0)
            throw new Error("1st argument of `grid` must be a valid positive number");
          if (isNaN(+ySnap) || ySnap < 0)
            throw new Error("2nd argument of `grid` must be a valid positive number");
          let [deltaX, deltaY] = [finalX - initialX, finalY - initialY];
          [deltaX, deltaY] = snapToGrid([Math.floor(xSnap / inverseScale), Math.floor(ySnap / inverseScale)], deltaX, deltaY);
          if (!deltaX && !deltaY)
            return;
          [finalX, finalY] = [initialX + deltaX, initialY + deltaY];
        }
        if (canMoveInX)
          translateX = (finalX - initialX) * inverseScale;
        if (canMoveInY)
          translateY = (finalY - initialY) * inverseScale;
        [xOffset, yOffset] = [translateX, translateY];
        fireSvelteDragEvent(node, translateX, translateY);
        Promise.resolve().then(() => setTranslate(translateX, translateY, node, gpuAcceleration));
      }
      return {
        destroy: () => {
          const unlisten = removeEventListener;
          unlisten("touchstart", dragStart, false);
          unlisten("touchend", dragEnd, false);
          unlisten("touchmove", drag, false);
          unlisten("mousedown", dragStart, false);
          unlisten("mouseup", dragEnd, false);
          unlisten("mousemove", drag, false);
        },
        update: (options2) => {
          var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k;
          axis = options2.axis || "both";
          disabled = (_a = options2.disabled) != null ? _a : false;
          ignoreMultitouch = (_b = options2.ignoreMultitouch) != null ? _b : false;
          handle = options2.handle;
          bounds = options2.bounds;
          cancel = options2.cancel;
          applyUserSelectHack = (_c = options2.applyUserSelectHack) != null ? _c : true;
          grid = options2.grid;
          gpuAcceleration = (_d = options2.gpuAcceleration) != null ? _d : true;
          const dragged = node.classList.contains(defaultClassDragged);
          node.classList.remove(defaultClass, defaultClassDragged);
          defaultClass = (_e = options2.defaultClass) != null ? _e : DEFAULT_CLASS.MAIN;
          defaultClassDragging = (_f = options2.defaultClassDragging) != null ? _f : DEFAULT_CLASS.DRAGGING;
          defaultClassDragged = (_g = options2.defaultClassDragged) != null ? _g : DEFAULT_CLASS.DRAGGED;
          node.classList.add(defaultClass);
          if (dragged)
            node.classList.add(defaultClassDragged);
          if (isControlled) {
            xOffset = translateX = (_i = (_h = options2.position) == null ? void 0 : _h.x) != null ? _i : translateX;
            yOffset = translateY = (_k = (_j = options2.position) == null ? void 0 : _j.y) != null ? _k : translateY;
            Promise.resolve().then(() => setTranslate(translateX, translateY, node, gpuAcceleration));
          }
        }
      };
    };
    function isTouchEvent(event) {
      return Boolean(event.touches && event.touches.length);
    }
    function isString$1(val) {
      return typeof val === "string";
    }
    var snapToGrid = memoize_default(([xSnap, ySnap], pendingX, pendingY) => {
      const x = Math.round(pendingX / xSnap) * xSnap;
      const y = Math.round(pendingY / ySnap) * ySnap;
      return [x, y];
    });
    function getDragEl(handle, node) {
      if (!handle)
        return node;
      const handleEl = node.querySelector(handle);
      if (handleEl === null)
        throw new Error("Selector passed for `handle` option should be child of the element on which the action is applied");
      return handleEl;
    }
    function getCancelElement(cancel, node) {
      if (!cancel)
        return;
      const cancelEl = node.querySelector(cancel);
      if (cancelEl === null)
        throw new Error("Selector passed for `cancel` option should be child of the element on which the action is applied");
      return cancelEl;
    }
    function computeBoundRect(bounds, rootNode) {
      if (typeof bounds === "object") {
        const [windowWidth, windowHeight] = [window.innerWidth, window.innerHeight];
        const { top = 0, left = 0, right = 0, bottom = 0 } = bounds;
        const computedRight = windowWidth - right;
        const computedBottom = windowHeight - bottom;
        return { top, right: computedRight, bottom: computedBottom, left };
      }
      if (bounds === "parent")
        return rootNode.parentNode.getBoundingClientRect();
      const node = document.querySelector(bounds);
      if (node === null)
        throw new Error("The selector provided for bound doesn't exists in the document.");
      const computedBounds = node.getBoundingClientRect();
      return computedBounds;
    }
    function setTranslate(xPos, yPos, el, gpuAcceleration) {
      el.style.transform = gpuAcceleration ? `translate3d(${+xPos}px, ${+yPos}px, 0)` : `translate(${+xPos}px, ${+yPos}px)`;
    }

    function itemContainer(node) {
    	let entered = false;

    	node.addEventListener('mouseenter', () => { entered =  true; });
    	node.addEventListener('mouseleave', () => { entered = false; });

    	document.addEventListener('drop', (event) => {
    		if (entered)
    			node.dispatchEvent(new CustomEvent('drop', { 'detail': event.detail }));
    	});
    }


    function globalDispatch(name, detail) {
    	document.dispatchEvent(new CustomEvent(name, { 'detail': detail }));
    }

    var css_248z$5 = "";
    styleInject(css_248z$5);

    /* src\ItemSlot.svelte generated by Svelte v3.46.2 */
    const file$6 = "src\\ItemSlot.svelte";

    // (41:2) {#if itemID >= 0}
    function create_if_block(ctx) {
    	let div2;
    	let div0;
    	let icon;
    	let t0;
    	let div1;
    	let t1;
    	let div2_style_value;
    	let div2_title_value;
    	let draggable_action;
    	let current;
    	let mounted;
    	let dispose;

    	icon = new Icon({
    			props: { id: /*itemID*/ ctx[3] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(icon.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			t1 = text(/*itemID*/ ctx[3]);
    			attr_dev(div0, "class", "item svelte-14cl4na");
    			add_location(div0, file$6, 49, 4, 1379);
    			attr_dev(div1, "class", "item-text svelte-14cl4na");
    			add_location(div1, file$6, 50, 4, 1427);
    			attr_dev(div2, "style", div2_style_value = "pointer-events: " + (/*dragging*/ ctx[0] ? "none" : "all") + "; " + (/*dragging*/ ctx[0] ? "z-index: 9999999;" : ""));
    			attr_dev(div2, "title", div2_title_value = /*getItem*/ ctx[8](/*itemID*/ ctx[3]).name);
    			add_location(div2, file$6, 41, 3, 908);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(icon, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			append_dev(div1, t1);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(draggable_action = draggable.call(null, div2, {
    						position: { y: /*y*/ ctx[7], x: /*x*/ ctx[6] }
    					})),
    					listen_dev(div2, "svelte-drag:start", /*svelte_drag_start_handler*/ ctx[9], false, false, false),
    					listen_dev(div2, "svelte-drag", /*svelte_drag_handler*/ ctx[10], false, false, false),
    					listen_dev(div2, "svelte-drag:end", /*svelte_drag_end_handler*/ ctx[11], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const icon_changes = {};
    			if (dirty & /*itemID*/ 8) icon_changes.id = /*itemID*/ ctx[3];
    			icon.$set(icon_changes);
    			if (!current || dirty & /*itemID*/ 8) set_data_dev(t1, /*itemID*/ ctx[3]);

    			if (!current || dirty & /*dragging*/ 1 && div2_style_value !== (div2_style_value = "pointer-events: " + (/*dragging*/ ctx[0] ? "none" : "all") + "; " + (/*dragging*/ ctx[0] ? "z-index: 9999999;" : ""))) {
    				attr_dev(div2, "style", div2_style_value);
    			}

    			if (!current || dirty & /*itemID*/ 8 && div2_title_value !== (div2_title_value = /*getItem*/ ctx[8](/*itemID*/ ctx[3]).name)) {
    				attr_dev(div2, "title", div2_title_value);
    			}

    			if (draggable_action && is_function(draggable_action.update) && dirty & /*y, x*/ 192) draggable_action.update.call(null, {
    				position: { y: /*y*/ ctx[7], x: /*x*/ ctx[6] }
    			});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(icon);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(41:2) {#if itemID >= 0}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$7(ctx) {
    	let div1;
    	let div0;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*itemID*/ ctx[3] >= 0 && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			if (if_block) if_block.c();
    			attr_dev(div0, "class", "slot svelte-14cl4na");
    			add_location(div0, file$6, 39, 1, 866);
    			attr_dev(div1, "class", "container svelte-14cl4na");

    			set_style(div1, "--background-color", /*background*/ ctx[5]
    			? /*highlighted*/ ctx[1] ? highlightColor$1 : bgColor$1
    			: '');

    			add_location(div1, file$6, 32, 0, 647);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			if (if_block) if_block.m(div0, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div1, "mouseenter", /*mouseenter_handler*/ ctx[12], false, false, false),
    					listen_dev(div1, "mouseleave", /*mouseleave_handler*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*itemID*/ ctx[3] >= 0) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*itemID*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div0, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*background, highlighted*/ 34) {
    				set_style(div1, "--background-color", /*background*/ ctx[5]
    				? /*highlighted*/ ctx[1] ? highlightColor$1 : bgColor$1
    				: '');
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const bgColor$1 = "rgb(63, 63, 63)", highlightColor$1 = "rgb(102, 102, 102)";

    function instance$7($$self, $$props, $$invalidate) {
    	let $ITEM_MAP;
    	validate_store(ITEM_MAP, 'ITEM_MAP');
    	component_subscribe($$self, ITEM_MAP, $$value => $$invalidate(14, $ITEM_MAP = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemSlot', slots, []);
    	let { container } = $$props;
    	let { itemID } = $$props;
    	let { slotID } = $$props;
    	let { background = true } = $$props;
    	const dispatch = createEventDispatcher();
    	let { dragging = false } = $$props;
    	let { highlighted = false } = $$props;
    	let x = 0, y = 0;

    	const getItem = id => {
    		if (id in $ITEM_MAP) return $ITEM_MAP[id]; else return $ITEM_MAP[0];
    	};

    	const writable_props = ['container', 'itemID', 'slotID', 'background', 'dragging', 'highlighted'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemSlot> was created with unknown prop '${key}'`);
    	});

    	const svelte_drag_start_handler = () => {
    		$$invalidate(0, dragging = true);
    	};

    	const svelte_drag_handler = e => {
    		$$invalidate(6, x = e.detail.offsetX);
    		$$invalidate(7, y = e.detail.offsetY);
    	};

    	const svelte_drag_end_handler = () => {
    		$$invalidate(0, dragging = false);
    		$$invalidate(6, x = 0);
    		$$invalidate(7, y = 0);
    		globalDispatch('drop', { source: container, itemID, slotID });
    	};

    	const mouseenter_handler = e => {
    		$$invalidate(1, highlighted = true);
    	};

    	const mouseleave_handler = e => {
    		$$invalidate(1, highlighted = false);
    	};

    	$$self.$$set = $$props => {
    		if ('container' in $$props) $$invalidate(2, container = $$props.container);
    		if ('itemID' in $$props) $$invalidate(3, itemID = $$props.itemID);
    		if ('slotID' in $$props) $$invalidate(4, slotID = $$props.slotID);
    		if ('background' in $$props) $$invalidate(5, background = $$props.background);
    		if ('dragging' in $$props) $$invalidate(0, dragging = $$props.dragging);
    		if ('highlighted' in $$props) $$invalidate(1, highlighted = $$props.highlighted);
    	};

    	$$self.$capture_state = () => ({
    		container,
    		itemID,
    		slotID,
    		background,
    		Icon,
    		draggable,
    		createEventDispatcher,
    		globalDispatch,
    		ITEM_MAP,
    		dispatch,
    		bgColor: bgColor$1,
    		highlightColor: highlightColor$1,
    		dragging,
    		highlighted,
    		x,
    		y,
    		getItem,
    		$ITEM_MAP
    	});

    	$$self.$inject_state = $$props => {
    		if ('container' in $$props) $$invalidate(2, container = $$props.container);
    		if ('itemID' in $$props) $$invalidate(3, itemID = $$props.itemID);
    		if ('slotID' in $$props) $$invalidate(4, slotID = $$props.slotID);
    		if ('background' in $$props) $$invalidate(5, background = $$props.background);
    		if ('dragging' in $$props) $$invalidate(0, dragging = $$props.dragging);
    		if ('highlighted' in $$props) $$invalidate(1, highlighted = $$props.highlighted);
    		if ('x' in $$props) $$invalidate(6, x = $$props.x);
    		if ('y' in $$props) $$invalidate(7, y = $$props.y);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		dragging,
    		highlighted,
    		container,
    		itemID,
    		slotID,
    		background,
    		x,
    		y,
    		getItem,
    		svelte_drag_start_handler,
    		svelte_drag_handler,
    		svelte_drag_end_handler,
    		mouseenter_handler,
    		mouseleave_handler
    	];
    }

    class ItemSlot extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {
    			container: 2,
    			itemID: 3,
    			slotID: 4,
    			background: 5,
    			dragging: 0,
    			highlighted: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemSlot",
    			options,
    			id: create_fragment$7.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*container*/ ctx[2] === undefined && !('container' in props)) {
    			console.warn("<ItemSlot> was created without expected prop 'container'");
    		}

    		if (/*itemID*/ ctx[3] === undefined && !('itemID' in props)) {
    			console.warn("<ItemSlot> was created without expected prop 'itemID'");
    		}

    		if (/*slotID*/ ctx[4] === undefined && !('slotID' in props)) {
    			console.warn("<ItemSlot> was created without expected prop 'slotID'");
    		}
    	}

    	get container() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set container(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get itemID() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set itemID(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get slotID() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set slotID(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get background() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set background(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get dragging() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set dragging(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get highlighted() {
    		throw new Error("<ItemSlot>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<ItemSlot>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z$4 = "";
    styleInject(css_248z$4);

    /* src\SettingsPanel.svelte generated by Svelte v3.46.2 */
    const file$5 = "src\\SettingsPanel.svelte";

    // (96:4) <Field label='Tag Name'>
    function create_default_slot$2(ctx) {
    	let input;
    	let updating_value;
    	let current;

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[5](value);
    	}

    	let input_props = { placeholder: "" };

    	if (/*$TAG_NAME*/ ctx[3] !== void 0) {
    		input_props.value = /*$TAG_NAME*/ ctx[3];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, 'value', input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (!updating_value && dirty & /*$TAG_NAME*/ 8) {
    				updating_value = true;
    				input_changes.value = /*$TAG_NAME*/ ctx[3];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(96:4) <Field label='Tag Name'>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let div5;
    	let div3;
    	let div2;
    	let div0;
    	let itemslot;
    	let t0;
    	let div1;
    	let field;
    	let t1;
    	let div4;
    	let a0;
    	let icon0;
    	let t2;
    	let t3;
    	let a1;
    	let icon1;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	itemslot = new ItemSlot({
    			props: {
    				container: "icon",
    				itemID: /*$SLOTS*/ ctx[2]['icon'][0],
    				slotID: 0
    			},
    			$$inline: true
    		});

    	field = new Field({
    			props: {
    				label: "Tag Name",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	icon0 = new Icon$1({
    			props: { pack: "fas", icon: "file-import" },
    			$$inline: true
    		});

    	icon1 = new Icon$1({
    			props: { pack: "fas", icon: "file-export" },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			create_component(itemslot.$$.fragment);
    			t0 = space();
    			div1 = element("div");
    			create_component(field.$$.fragment);
    			t1 = space();
    			div4 = element("div");
    			a0 = element("a");
    			create_component(icon0.$$.fragment);
    			t2 = text("  Import");
    			t3 = space();
    			a1 = element("a");
    			create_component(icon1.$$.fragment);
    			t4 = text("  Export");
    			attr_dev(div0, "class", "column item svelte-l3qfkm");
    			add_location(div0, file$5, 88, 3, 2315);
    			attr_dev(div1, "class", "column is-two-thirds item svelte-l3qfkm");
    			add_location(div1, file$5, 94, 3, 2514);
    			attr_dev(div2, "class", "columns is-mobile");
    			add_location(div2, file$5, 86, 2, 2279);
    			attr_dev(div3, "class", "card-content");
    			add_location(div3, file$5, 85, 1, 2250);
    			attr_dev(a0, "class", "card-footer-item");
    			add_location(a0, file$5, 103, 2, 2705);
    			attr_dev(a1, "class", "card-footer-item");
    			add_location(a1, file$5, 104, 2, 2815);
    			attr_dev(div4, "class", "card-footer");
    			add_location(div4, file$5, 102, 1, 2677);
    			attr_dev(div5, "class", "card");
    			add_location(div5, file$5, 84, 0, 2230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div3);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			mount_component(itemslot, div0, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			mount_component(field, div1, null);
    			append_dev(div5, t1);
    			append_dev(div5, div4);
    			append_dev(div4, a0);
    			mount_component(icon0, a0, null);
    			append_dev(a0, t2);
    			append_dev(div4, t3);
    			append_dev(div4, a1);
    			mount_component(icon1, a1, null);
    			append_dev(a1, t4);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(itemContainer.call(null, div0)),
    					listen_dev(div0, "drop", /*drop_handler*/ ctx[4], false, false, false),
    					listen_dev(a0, "click", /*importLayout*/ ctx[0], false, false, false),
    					listen_dev(a1, "click", /*exportLayout*/ ctx[1], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const itemslot_changes = {};
    			if (dirty & /*$SLOTS*/ 4) itemslot_changes.itemID = /*$SLOTS*/ ctx[2]['icon'][0];
    			itemslot.$set(itemslot_changes);
    			const field_changes = {};

    			if (dirty & /*$$scope, $TAG_NAME*/ 72) {
    				field_changes.$$scope = { dirty, ctx };
    			}

    			field.$set(field_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemslot.$$.fragment, local);
    			transition_in(field.$$.fragment, local);
    			transition_in(icon0.$$.fragment, local);
    			transition_in(icon1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemslot.$$.fragment, local);
    			transition_out(field.$$.fragment, local);
    			transition_out(icon0.$$.fragment, local);
    			transition_out(icon1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			destroy_component(itemslot);
    			destroy_component(field);
    			destroy_component(icon0);
    			destroy_component(icon1);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$6($$self, $$props, $$invalidate) {
    	let $SLOTS;
    	let $TAG_NAME;
    	validate_store(SLOTS, 'SLOTS');
    	component_subscribe($$self, SLOTS, $$value => $$invalidate(2, $SLOTS = $$value));
    	validate_store(TAG_NAME, 'TAG_NAME');
    	component_subscribe($$self, TAG_NAME, $$value => $$invalidate(3, $TAG_NAME = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SettingsPanel', slots, []);
    	set_store_value(SLOTS, $SLOTS['icon'] = [-1], $SLOTS);

    	const importLayout = e => {
    		navigator.clipboard.readText().then(text => {
    			var bankLayoutItems = text.substring(text.indexOf("banktaglayoutsplugin:") + 1, text.indexOf(",banktag"));
    			bankLayoutItems = bankLayoutItems.split(",");
    			set_store_value(TAG_NAME, $TAG_NAME = bankLayoutItems[0].split(":")[1], $TAG_NAME);
    			var banktagItems = text.substring(text.indexOf("banktag:") + 1);
    			banktagItems = banktagItems.split(',');
    			set_store_value(SLOTS, $SLOTS['icon'][0] = parseInt(banktagItems[1]), $SLOTS);
    			var layoutItems = new Set();
    			$SLOTS['grid'].fill(-1);

    			for (var i = 1; i < bankLayoutItems.length; i++) {
    				var parsed = bankLayoutItems[i].split(':');
    				var item = parseInt(parsed[0]);
    				var idx = parseInt(parsed[1]);
    				set_store_value(SLOTS, $SLOTS['grid'][idx] = item, $SLOTS);
    				layoutItems.add(item);
    			}

    			var tagItems = new Set();

    			for (var i = 2; i < banktagItems.length; i++) {
    				var item = parseInt(banktagItems[i]);
    				if (!layoutItems.has(item)) tagItems.add(item);
    			}

    			set_store_value(SLOTS, $SLOTS['taggedItems'] = [...tagItems], $SLOTS);

    			Toast.create({
    				message: 'Layout imported successfully',
    				type: 'is-success',
    				position: 'is-bottom-left'
    			});
    		}).catch(e => {
    			Toast.create({
    				message: 'Error importing layout: ' + e.message,
    				type: 'is-danger',
    				position: 'is-bottom-left'
    			});
    		});
    	};

    	const exportLayout = e => {
    		try {
    			var out = "";
    			out += "banktaglayoutsplugin:" + $TAG_NAME + ",";

    			for (var i = 0; i < $SLOTS['grid'].length; i++) if ($SLOTS['grid'][i] >= 0) {
    				out += $SLOTS['grid'][i] + ":" + i + ",";
    			}

    			out += "banktag:" + $TAG_NAME + "," + ($SLOTS['icon'][0] >= 0 ? $SLOTS['icon'][0] : 0) + ',';
    			out += $SLOTS['items'].filter(x => x >= 0).join(',');
    			navigator.clipboard.writeText(out);

    			Toast.create({
    				message: 'Layout exported successfully',
    				type: 'is-success',
    				position: 'is-bottom-left'
    			});
    		} catch(e) {
    			Toast.create({
    				message: 'Error exporting layout: ' + e.message,
    				type: 'is-danger',
    				position: 'is-bottom-left'
    			});
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SettingsPanel> was created with unknown prop '${key}'`);
    	});

    	const drop_handler = e => {
    		set_store_value(SLOTS, $SLOTS['icon'][0] = e.detail.itemID, $SLOTS);
    	};

    	function input_value_binding(value) {
    		$TAG_NAME = value;
    		TAG_NAME.set($TAG_NAME);
    	}

    	$$self.$capture_state = () => ({
    		Field,
    		Input,
    		Icon: Icon$1,
    		Toast,
    		ItemSlot,
    		SLOTS,
    		TAG_NAME,
    		itemContainer,
    		importLayout,
    		exportLayout,
    		$SLOTS,
    		$TAG_NAME
    	});

    	return [
    		importLayout,
    		exportLayout,
    		$SLOTS,
    		$TAG_NAME,
    		drop_handler,
    		input_value_binding
    	];
    }

    class SettingsPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { importLayout: 0, exportLayout: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SettingsPanel",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get importLayout() {
    		return this.$$.ctx[0];
    	}

    	set importLayout(value) {
    		throw new Error("<SettingsPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get exportLayout() {
    		return this.$$.ctx[1];
    	}

    	set exportLayout(value) {
    		throw new Error("<SettingsPanel>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Fuse.js v6.5.3 - Lightweight fuzzy-search (http://fusejs.io)
     *
     * Copyright (c) 2021 Kiro Risk (http://kiro.me)
     * All Rights Reserved. Apache Software License 2.0
     *
     * http://www.apache.org/licenses/LICENSE-2.0
     */

    function isArray(value) {
      return !Array.isArray
        ? getTag(value) === '[object Array]'
        : Array.isArray(value)
    }

    // Adapted from: https://github.com/lodash/lodash/blob/master/.internal/baseToString.js
    const INFINITY = 1 / 0;
    function baseToString(value) {
      // Exit early for strings to avoid a performance hit in some environments.
      if (typeof value == 'string') {
        return value
      }
      let result = value + '';
      return result == '0' && 1 / value == -INFINITY ? '-0' : result
    }

    function toString(value) {
      return value == null ? '' : baseToString(value)
    }

    function isString(value) {
      return typeof value === 'string'
    }

    function isNumber(value) {
      return typeof value === 'number'
    }

    // Adapted from: https://github.com/lodash/lodash/blob/master/isBoolean.js
    function isBoolean(value) {
      return (
        value === true ||
        value === false ||
        (isObjectLike(value) && getTag(value) == '[object Boolean]')
      )
    }

    function isObject(value) {
      return typeof value === 'object'
    }

    // Checks if `value` is object-like.
    function isObjectLike(value) {
      return isObject(value) && value !== null
    }

    function isDefined(value) {
      return value !== undefined && value !== null
    }

    function isBlank(value) {
      return !value.trim().length
    }

    // Gets the `toStringTag` of `value`.
    // Adapted from: https://github.com/lodash/lodash/blob/master/.internal/getTag.js
    function getTag(value) {
      return value == null
        ? value === undefined
          ? '[object Undefined]'
          : '[object Null]'
        : Object.prototype.toString.call(value)
    }

    const EXTENDED_SEARCH_UNAVAILABLE = 'Extended search is not available';

    const INCORRECT_INDEX_TYPE = "Incorrect 'index' type";

    const LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY = (key) =>
      `Invalid value for key ${key}`;

    const PATTERN_LENGTH_TOO_LARGE = (max) =>
      `Pattern length exceeds max of ${max}.`;

    const MISSING_KEY_PROPERTY = (name) => `Missing ${name} property in key`;

    const INVALID_KEY_WEIGHT_VALUE = (key) =>
      `Property 'weight' in key '${key}' must be a positive integer`;

    const hasOwn = Object.prototype.hasOwnProperty;

    class KeyStore {
      constructor(keys) {
        this._keys = [];
        this._keyMap = {};

        let totalWeight = 0;

        keys.forEach((key) => {
          let obj = createKey(key);

          totalWeight += obj.weight;

          this._keys.push(obj);
          this._keyMap[obj.id] = obj;

          totalWeight += obj.weight;
        });

        // Normalize weights so that their sum is equal to 1
        this._keys.forEach((key) => {
          key.weight /= totalWeight;
        });
      }
      get(keyId) {
        return this._keyMap[keyId]
      }
      keys() {
        return this._keys
      }
      toJSON() {
        return JSON.stringify(this._keys)
      }
    }

    function createKey(key) {
      let path = null;
      let id = null;
      let src = null;
      let weight = 1;

      if (isString(key) || isArray(key)) {
        src = key;
        path = createKeyPath(key);
        id = createKeyId(key);
      } else {
        if (!hasOwn.call(key, 'name')) {
          throw new Error(MISSING_KEY_PROPERTY('name'))
        }

        const name = key.name;
        src = name;

        if (hasOwn.call(key, 'weight')) {
          weight = key.weight;

          if (weight <= 0) {
            throw new Error(INVALID_KEY_WEIGHT_VALUE(name))
          }
        }

        path = createKeyPath(name);
        id = createKeyId(name);
      }

      return { path, id, weight, src }
    }

    function createKeyPath(key) {
      return isArray(key) ? key : key.split('.')
    }

    function createKeyId(key) {
      return isArray(key) ? key.join('.') : key
    }

    function get(obj, path) {
      let list = [];
      let arr = false;

      const deepGet = (obj, path, index) => {
        if (!isDefined(obj)) {
          return
        }
        if (!path[index]) {
          // If there's no path left, we've arrived at the object we care about.
          list.push(obj);
        } else {
          let key = path[index];

          const value = obj[key];

          if (!isDefined(value)) {
            return
          }

          // If we're at the last value in the path, and if it's a string/number/bool,
          // add it to the list
          if (
            index === path.length - 1 &&
            (isString(value) || isNumber(value) || isBoolean(value))
          ) {
            list.push(toString(value));
          } else if (isArray(value)) {
            arr = true;
            // Search each item in the array.
            for (let i = 0, len = value.length; i < len; i += 1) {
              deepGet(value[i], path, index + 1);
            }
          } else if (path.length) {
            // An object. Recurse further.
            deepGet(value, path, index + 1);
          }
        }
      };

      // Backwards compatibility (since path used to be a string)
      deepGet(obj, isString(path) ? path.split('.') : path, 0);

      return arr ? list : list[0]
    }

    const MatchOptions = {
      // Whether the matches should be included in the result set. When `true`, each record in the result
      // set will include the indices of the matched characters.
      // These can consequently be used for highlighting purposes.
      includeMatches: false,
      // When `true`, the matching function will continue to the end of a search pattern even if
      // a perfect match has already been located in the string.
      findAllMatches: false,
      // Minimum number of characters that must be matched before a result is considered a match
      minMatchCharLength: 1
    };

    const BasicOptions = {
      // When `true`, the algorithm continues searching to the end of the input even if a perfect
      // match is found before the end of the same input.
      isCaseSensitive: false,
      // When true, the matching function will continue to the end of a search pattern even if
      includeScore: false,
      // List of properties that will be searched. This also supports nested properties.
      keys: [],
      // Whether to sort the result list, by score
      shouldSort: true,
      // Default sort function: sort by ascending score, ascending index
      sortFn: (a, b) =>
        a.score === b.score ? (a.idx < b.idx ? -1 : 1) : a.score < b.score ? -1 : 1
    };

    const FuzzyOptions = {
      // Approximately where in the text is the pattern expected to be found?
      location: 0,
      // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
      // (of both letters and location), a threshold of '1.0' would match anything.
      threshold: 0.6,
      // Determines how close the match must be to the fuzzy location (specified above).
      // An exact letter match which is 'distance' characters away from the fuzzy location
      // would score as a complete mismatch. A distance of '0' requires the match be at
      // the exact location specified, a threshold of '1000' would require a perfect match
      // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
      distance: 100
    };

    const AdvancedOptions = {
      // When `true`, it enables the use of unix-like search commands
      useExtendedSearch: false,
      // The get function to use when fetching an object's properties.
      // The default will search nested paths *ie foo.bar.baz*
      getFn: get,
      // When `true`, search will ignore `location` and `distance`, so it won't matter
      // where in the string the pattern appears.
      // More info: https://fusejs.io/concepts/scoring-theory.html#fuzziness-score
      ignoreLocation: false,
      // When `true`, the calculation for the relevance score (used for sorting) will
      // ignore the field-length norm.
      // More info: https://fusejs.io/concepts/scoring-theory.html#field-length-norm
      ignoreFieldNorm: false,
      // The weight to determine how much field length norm effects scoring.
      fieldNormWeight: 1
    };

    var Config = {
      ...BasicOptions,
      ...MatchOptions,
      ...FuzzyOptions,
      ...AdvancedOptions
    };

    const SPACE = /[^ ]+/g;

    // Field-length norm: the shorter the field, the higher the weight.
    // Set to 3 decimals to reduce index size.
    function norm(weight = 1, mantissa = 3) {
      const cache = new Map();
      const m = Math.pow(10, mantissa);

      return {
        get(value) {
          const numTokens = value.match(SPACE).length;

          if (cache.has(numTokens)) {
            return cache.get(numTokens)
          }

          // Default function is 1/sqrt(x), weight makes that variable
          const norm = 1 / Math.pow(numTokens, 0.5 * weight);

          // In place of `toFixed(mantissa)`, for faster computation
          const n = parseFloat(Math.round(norm * m) / m);

          cache.set(numTokens, n);

          return n
        },
        clear() {
          cache.clear();
        }
      }
    }

    class FuseIndex {
      constructor({
        getFn = Config.getFn,
        fieldNormWeight = Config.fieldNormWeight
      } = {}) {
        this.norm = norm(fieldNormWeight, 3);
        this.getFn = getFn;
        this.isCreated = false;

        this.setIndexRecords();
      }
      setSources(docs = []) {
        this.docs = docs;
      }
      setIndexRecords(records = []) {
        this.records = records;
      }
      setKeys(keys = []) {
        this.keys = keys;
        this._keysMap = {};
        keys.forEach((key, idx) => {
          this._keysMap[key.id] = idx;
        });
      }
      create() {
        if (this.isCreated || !this.docs.length) {
          return
        }

        this.isCreated = true;

        // List is Array<String>
        if (isString(this.docs[0])) {
          this.docs.forEach((doc, docIndex) => {
            this._addString(doc, docIndex);
          });
        } else {
          // List is Array<Object>
          this.docs.forEach((doc, docIndex) => {
            this._addObject(doc, docIndex);
          });
        }

        this.norm.clear();
      }
      // Adds a doc to the end of the index
      add(doc) {
        const idx = this.size();

        if (isString(doc)) {
          this._addString(doc, idx);
        } else {
          this._addObject(doc, idx);
        }
      }
      // Removes the doc at the specified index of the index
      removeAt(idx) {
        this.records.splice(idx, 1);

        // Change ref index of every subsquent doc
        for (let i = idx, len = this.size(); i < len; i += 1) {
          this.records[i].i -= 1;
        }
      }
      getValueForItemAtKeyId(item, keyId) {
        return item[this._keysMap[keyId]]
      }
      size() {
        return this.records.length
      }
      _addString(doc, docIndex) {
        if (!isDefined(doc) || isBlank(doc)) {
          return
        }

        let record = {
          v: doc,
          i: docIndex,
          n: this.norm.get(doc)
        };

        this.records.push(record);
      }
      _addObject(doc, docIndex) {
        let record = { i: docIndex, $: {} };

        // Iterate over every key (i.e, path), and fetch the value at that key
        this.keys.forEach((key, keyIndex) => {
          // console.log(key)
          let value = this.getFn(doc, key.path);

          if (!isDefined(value)) {
            return
          }

          if (isArray(value)) {
            let subRecords = [];
            const stack = [{ nestedArrIndex: -1, value }];

            while (stack.length) {
              const { nestedArrIndex, value } = stack.pop();

              if (!isDefined(value)) {
                continue
              }

              if (isString(value) && !isBlank(value)) {
                let subRecord = {
                  v: value,
                  i: nestedArrIndex,
                  n: this.norm.get(value)
                };

                subRecords.push(subRecord);
              } else if (isArray(value)) {
                value.forEach((item, k) => {
                  stack.push({
                    nestedArrIndex: k,
                    value: item
                  });
                });
              } else ;
            }
            record.$[keyIndex] = subRecords;
          } else if (!isBlank(value)) {
            let subRecord = {
              v: value,
              n: this.norm.get(value)
            };

            record.$[keyIndex] = subRecord;
          }
        });

        this.records.push(record);
      }
      toJSON() {
        return {
          keys: this.keys,
          records: this.records
        }
      }
    }

    function createIndex(
      keys,
      docs,
      { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
    ) {
      const myIndex = new FuseIndex({ getFn, fieldNormWeight });
      myIndex.setKeys(keys.map(createKey));
      myIndex.setSources(docs);
      myIndex.create();
      return myIndex
    }

    function parseIndex(
      data,
      { getFn = Config.getFn, fieldNormWeight = Config.fieldNormWeight } = {}
    ) {
      const { keys, records } = data;
      const myIndex = new FuseIndex({ getFn, fieldNormWeight });
      myIndex.setKeys(keys);
      myIndex.setIndexRecords(records);
      return myIndex
    }

    function computeScore$1(
      pattern,
      {
        errors = 0,
        currentLocation = 0,
        expectedLocation = 0,
        distance = Config.distance,
        ignoreLocation = Config.ignoreLocation
      } = {}
    ) {
      const accuracy = errors / pattern.length;

      if (ignoreLocation) {
        return accuracy
      }

      const proximity = Math.abs(expectedLocation - currentLocation);

      if (!distance) {
        // Dodge divide by zero error.
        return proximity ? 1.0 : accuracy
      }

      return accuracy + proximity / distance
    }

    function convertMaskToIndices(
      matchmask = [],
      minMatchCharLength = Config.minMatchCharLength
    ) {
      let indices = [];
      let start = -1;
      let end = -1;
      let i = 0;

      for (let len = matchmask.length; i < len; i += 1) {
        let match = matchmask[i];
        if (match && start === -1) {
          start = i;
        } else if (!match && start !== -1) {
          end = i - 1;
          if (end - start + 1 >= minMatchCharLength) {
            indices.push([start, end]);
          }
          start = -1;
        }
      }

      // (i-1 - start) + 1 => i - start
      if (matchmask[i - 1] && i - start >= minMatchCharLength) {
        indices.push([start, i - 1]);
      }

      return indices
    }

    // Machine word size
    const MAX_BITS = 32;

    function search(
      text,
      pattern,
      patternAlphabet,
      {
        location = Config.location,
        distance = Config.distance,
        threshold = Config.threshold,
        findAllMatches = Config.findAllMatches,
        minMatchCharLength = Config.minMatchCharLength,
        includeMatches = Config.includeMatches,
        ignoreLocation = Config.ignoreLocation
      } = {}
    ) {
      if (pattern.length > MAX_BITS) {
        throw new Error(PATTERN_LENGTH_TOO_LARGE(MAX_BITS))
      }

      const patternLen = pattern.length;
      // Set starting location at beginning text and initialize the alphabet.
      const textLen = text.length;
      // Handle the case when location > text.length
      const expectedLocation = Math.max(0, Math.min(location, textLen));
      // Highest score beyond which we give up.
      let currentThreshold = threshold;
      // Is there a nearby exact match? (speedup)
      let bestLocation = expectedLocation;

      // Performance: only computer matches when the minMatchCharLength > 1
      // OR if `includeMatches` is true.
      const computeMatches = minMatchCharLength > 1 || includeMatches;
      // A mask of the matches, used for building the indices
      const matchMask = computeMatches ? Array(textLen) : [];

      let index;

      // Get all exact matches, here for speed up
      while ((index = text.indexOf(pattern, bestLocation)) > -1) {
        let score = computeScore$1(pattern, {
          currentLocation: index,
          expectedLocation,
          distance,
          ignoreLocation
        });

        currentThreshold = Math.min(score, currentThreshold);
        bestLocation = index + patternLen;

        if (computeMatches) {
          let i = 0;
          while (i < patternLen) {
            matchMask[index + i] = 1;
            i += 1;
          }
        }
      }

      // Reset the best location
      bestLocation = -1;

      let lastBitArr = [];
      let finalScore = 1;
      let binMax = patternLen + textLen;

      const mask = 1 << (patternLen - 1);

      for (let i = 0; i < patternLen; i += 1) {
        // Scan for the best match; each iteration allows for one more error.
        // Run a binary search to determine how far from the match location we can stray
        // at this error level.
        let binMin = 0;
        let binMid = binMax;

        while (binMin < binMid) {
          const score = computeScore$1(pattern, {
            errors: i,
            currentLocation: expectedLocation + binMid,
            expectedLocation,
            distance,
            ignoreLocation
          });

          if (score <= currentThreshold) {
            binMin = binMid;
          } else {
            binMax = binMid;
          }

          binMid = Math.floor((binMax - binMin) / 2 + binMin);
        }

        // Use the result from this iteration as the maximum for the next.
        binMax = binMid;

        let start = Math.max(1, expectedLocation - binMid + 1);
        let finish = findAllMatches
          ? textLen
          : Math.min(expectedLocation + binMid, textLen) + patternLen;

        // Initialize the bit array
        let bitArr = Array(finish + 2);

        bitArr[finish + 1] = (1 << i) - 1;

        for (let j = finish; j >= start; j -= 1) {
          let currentLocation = j - 1;
          let charMatch = patternAlphabet[text.charAt(currentLocation)];

          if (computeMatches) {
            // Speed up: quick bool to int conversion (i.e, `charMatch ? 1 : 0`)
            matchMask[currentLocation] = +!!charMatch;
          }

          // First pass: exact match
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch;

          // Subsequent passes: fuzzy match
          if (i) {
            bitArr[j] |=
              ((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1 | lastBitArr[j + 1];
          }

          if (bitArr[j] & mask) {
            finalScore = computeScore$1(pattern, {
              errors: i,
              currentLocation,
              expectedLocation,
              distance,
              ignoreLocation
            });

            // This match will almost certainly be better than any existing match.
            // But check anyway.
            if (finalScore <= currentThreshold) {
              // Indeed it is
              currentThreshold = finalScore;
              bestLocation = currentLocation;

              // Already passed `loc`, downhill from here on in.
              if (bestLocation <= expectedLocation) {
                break
              }

              // When passing `bestLocation`, don't exceed our current distance from `expectedLocation`.
              start = Math.max(1, 2 * expectedLocation - bestLocation);
            }
          }
        }

        // No hope for a (better) match at greater error levels.
        const score = computeScore$1(pattern, {
          errors: i + 1,
          currentLocation: expectedLocation,
          expectedLocation,
          distance,
          ignoreLocation
        });

        if (score > currentThreshold) {
          break
        }

        lastBitArr = bitArr;
      }

      const result = {
        isMatch: bestLocation >= 0,
        // Count exact matches (those with a score of 0) to be "almost" exact
        score: Math.max(0.001, finalScore)
      };

      if (computeMatches) {
        const indices = convertMaskToIndices(matchMask, minMatchCharLength);
        if (!indices.length) {
          result.isMatch = false;
        } else if (includeMatches) {
          result.indices = indices;
        }
      }

      return result
    }

    function createPatternAlphabet(pattern) {
      let mask = {};

      for (let i = 0, len = pattern.length; i < len; i += 1) {
        const char = pattern.charAt(i);
        mask[char] = (mask[char] || 0) | (1 << (len - i - 1));
      }

      return mask
    }

    class BitapSearch {
      constructor(
        pattern,
        {
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance,
          includeMatches = Config.includeMatches,
          findAllMatches = Config.findAllMatches,
          minMatchCharLength = Config.minMatchCharLength,
          isCaseSensitive = Config.isCaseSensitive,
          ignoreLocation = Config.ignoreLocation
        } = {}
      ) {
        this.options = {
          location,
          threshold,
          distance,
          includeMatches,
          findAllMatches,
          minMatchCharLength,
          isCaseSensitive,
          ignoreLocation
        };

        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();

        this.chunks = [];

        if (!this.pattern.length) {
          return
        }

        const addChunk = (pattern, startIndex) => {
          this.chunks.push({
            pattern,
            alphabet: createPatternAlphabet(pattern),
            startIndex
          });
        };

        const len = this.pattern.length;

        if (len > MAX_BITS) {
          let i = 0;
          const remainder = len % MAX_BITS;
          const end = len - remainder;

          while (i < end) {
            addChunk(this.pattern.substr(i, MAX_BITS), i);
            i += MAX_BITS;
          }

          if (remainder) {
            const startIndex = len - MAX_BITS;
            addChunk(this.pattern.substr(startIndex), startIndex);
          }
        } else {
          addChunk(this.pattern, 0);
        }
      }

      searchIn(text) {
        const { isCaseSensitive, includeMatches } = this.options;

        if (!isCaseSensitive) {
          text = text.toLowerCase();
        }

        // Exact match
        if (this.pattern === text) {
          let result = {
            isMatch: true,
            score: 0
          };

          if (includeMatches) {
            result.indices = [[0, text.length - 1]];
          }

          return result
        }

        // Otherwise, use Bitap algorithm
        const {
          location,
          distance,
          threshold,
          findAllMatches,
          minMatchCharLength,
          ignoreLocation
        } = this.options;

        let allIndices = [];
        let totalScore = 0;
        let hasMatches = false;

        this.chunks.forEach(({ pattern, alphabet, startIndex }) => {
          const { isMatch, score, indices } = search(text, pattern, alphabet, {
            location: location + startIndex,
            distance,
            threshold,
            findAllMatches,
            minMatchCharLength,
            includeMatches,
            ignoreLocation
          });

          if (isMatch) {
            hasMatches = true;
          }

          totalScore += score;

          if (isMatch && indices) {
            allIndices = [...allIndices, ...indices];
          }
        });

        let result = {
          isMatch: hasMatches,
          score: hasMatches ? totalScore / this.chunks.length : 1
        };

        if (hasMatches && includeMatches) {
          result.indices = allIndices;
        }

        return result
      }
    }

    class BaseMatch {
      constructor(pattern) {
        this.pattern = pattern;
      }
      static isMultiMatch(pattern) {
        return getMatch(pattern, this.multiRegex)
      }
      static isSingleMatch(pattern) {
        return getMatch(pattern, this.singleRegex)
      }
      search(/*text*/) {}
    }

    function getMatch(pattern, exp) {
      const matches = pattern.match(exp);
      return matches ? matches[1] : null
    }

    // Token: 'file

    class ExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'exact'
      }
      static get multiRegex() {
        return /^="(.*)"$/
      }
      static get singleRegex() {
        return /^=(.*)$/
      }
      search(text) {
        const isMatch = text === this.pattern;

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        }
      }
    }

    // Token: !fire

    class InverseExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-exact'
      }
      static get multiRegex() {
        return /^!"(.*)"$/
      }
      static get singleRegex() {
        return /^!(.*)$/
      }
      search(text) {
        const index = text.indexOf(this.pattern);
        const isMatch = index === -1;

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        }
      }
    }

    // Token: ^file

    class PrefixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'prefix-exact'
      }
      static get multiRegex() {
        return /^\^"(.*)"$/
      }
      static get singleRegex() {
        return /^\^(.*)$/
      }
      search(text) {
        const isMatch = text.startsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, this.pattern.length - 1]
        }
      }
    }

    // Token: !^fire

    class InversePrefixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-prefix-exact'
      }
      static get multiRegex() {
        return /^!\^"(.*)"$/
      }
      static get singleRegex() {
        return /^!\^(.*)$/
      }
      search(text) {
        const isMatch = !text.startsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        }
      }
    }

    // Token: .file$

    class SuffixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'suffix-exact'
      }
      static get multiRegex() {
        return /^"(.*)"\$$/
      }
      static get singleRegex() {
        return /^(.*)\$$/
      }
      search(text) {
        const isMatch = text.endsWith(this.pattern);

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [text.length - this.pattern.length, text.length - 1]
        }
      }
    }

    // Token: !.file$

    class InverseSuffixExactMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'inverse-suffix-exact'
      }
      static get multiRegex() {
        return /^!"(.*)"\$$/
      }
      static get singleRegex() {
        return /^!(.*)\$$/
      }
      search(text) {
        const isMatch = !text.endsWith(this.pattern);
        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices: [0, text.length - 1]
        }
      }
    }

    class FuzzyMatch extends BaseMatch {
      constructor(
        pattern,
        {
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance,
          includeMatches = Config.includeMatches,
          findAllMatches = Config.findAllMatches,
          minMatchCharLength = Config.minMatchCharLength,
          isCaseSensitive = Config.isCaseSensitive,
          ignoreLocation = Config.ignoreLocation
        } = {}
      ) {
        super(pattern);
        this._bitapSearch = new BitapSearch(pattern, {
          location,
          threshold,
          distance,
          includeMatches,
          findAllMatches,
          minMatchCharLength,
          isCaseSensitive,
          ignoreLocation
        });
      }
      static get type() {
        return 'fuzzy'
      }
      static get multiRegex() {
        return /^"(.*)"$/
      }
      static get singleRegex() {
        return /^(.*)$/
      }
      search(text) {
        return this._bitapSearch.searchIn(text)
      }
    }

    // Token: 'file

    class IncludeMatch extends BaseMatch {
      constructor(pattern) {
        super(pattern);
      }
      static get type() {
        return 'include'
      }
      static get multiRegex() {
        return /^'"(.*)"$/
      }
      static get singleRegex() {
        return /^'(.*)$/
      }
      search(text) {
        let location = 0;
        let index;

        const indices = [];
        const patternLen = this.pattern.length;

        // Get all exact matches
        while ((index = text.indexOf(this.pattern, location)) > -1) {
          location = index + patternLen;
          indices.push([index, location - 1]);
        }

        const isMatch = !!indices.length;

        return {
          isMatch,
          score: isMatch ? 0 : 1,
          indices
        }
      }
    }

    // ❗Order is important. DO NOT CHANGE.
    const searchers = [
      ExactMatch,
      IncludeMatch,
      PrefixExactMatch,
      InversePrefixExactMatch,
      InverseSuffixExactMatch,
      SuffixExactMatch,
      InverseExactMatch,
      FuzzyMatch
    ];

    const searchersLen = searchers.length;

    // Regex to split by spaces, but keep anything in quotes together
    const SPACE_RE = / +(?=([^\"]*\"[^\"]*\")*[^\"]*$)/;
    const OR_TOKEN = '|';

    // Return a 2D array representation of the query, for simpler parsing.
    // Example:
    // "^core go$ | rb$ | py$ xy$" => [["^core", "go$"], ["rb$"], ["py$", "xy$"]]
    function parseQuery(pattern, options = {}) {
      return pattern.split(OR_TOKEN).map((item) => {
        let query = item
          .trim()
          .split(SPACE_RE)
          .filter((item) => item && !!item.trim());

        let results = [];
        for (let i = 0, len = query.length; i < len; i += 1) {
          const queryItem = query[i];

          // 1. Handle multiple query match (i.e, once that are quoted, like `"hello world"`)
          let found = false;
          let idx = -1;
          while (!found && ++idx < searchersLen) {
            const searcher = searchers[idx];
            let token = searcher.isMultiMatch(queryItem);
            if (token) {
              results.push(new searcher(token, options));
              found = true;
            }
          }

          if (found) {
            continue
          }

          // 2. Handle single query matches (i.e, once that are *not* quoted)
          idx = -1;
          while (++idx < searchersLen) {
            const searcher = searchers[idx];
            let token = searcher.isSingleMatch(queryItem);
            if (token) {
              results.push(new searcher(token, options));
              break
            }
          }
        }

        return results
      })
    }

    // These extended matchers can return an array of matches, as opposed
    // to a singl match
    const MultiMatchSet = new Set([FuzzyMatch.type, IncludeMatch.type]);

    /**
     * Command-like searching
     * ======================
     *
     * Given multiple search terms delimited by spaces.e.g. `^jscript .python$ ruby !java`,
     * search in a given text.
     *
     * Search syntax:
     *
     * | Token       | Match type                 | Description                            |
     * | ----------- | -------------------------- | -------------------------------------- |
     * | `jscript`   | fuzzy-match                | Items that fuzzy match `jscript`       |
     * | `=scheme`   | exact-match                | Items that are `scheme`                |
     * | `'python`   | include-match              | Items that include `python`            |
     * | `!ruby`     | inverse-exact-match        | Items that do not include `ruby`       |
     * | `^java`     | prefix-exact-match         | Items that start with `java`           |
     * | `!^earlang` | inverse-prefix-exact-match | Items that do not start with `earlang` |
     * | `.js$`      | suffix-exact-match         | Items that end with `.js`              |
     * | `!.go$`     | inverse-suffix-exact-match | Items that do not end with `.go`       |
     *
     * A single pipe character acts as an OR operator. For example, the following
     * query matches entries that start with `core` and end with either`go`, `rb`,
     * or`py`.
     *
     * ```
     * ^core go$ | rb$ | py$
     * ```
     */
    class ExtendedSearch {
      constructor(
        pattern,
        {
          isCaseSensitive = Config.isCaseSensitive,
          includeMatches = Config.includeMatches,
          minMatchCharLength = Config.minMatchCharLength,
          ignoreLocation = Config.ignoreLocation,
          findAllMatches = Config.findAllMatches,
          location = Config.location,
          threshold = Config.threshold,
          distance = Config.distance
        } = {}
      ) {
        this.query = null;
        this.options = {
          isCaseSensitive,
          includeMatches,
          minMatchCharLength,
          findAllMatches,
          ignoreLocation,
          location,
          threshold,
          distance
        };

        this.pattern = isCaseSensitive ? pattern : pattern.toLowerCase();
        this.query = parseQuery(this.pattern, this.options);
      }

      static condition(_, options) {
        return options.useExtendedSearch
      }

      searchIn(text) {
        const query = this.query;

        if (!query) {
          return {
            isMatch: false,
            score: 1
          }
        }

        const { includeMatches, isCaseSensitive } = this.options;

        text = isCaseSensitive ? text : text.toLowerCase();

        let numMatches = 0;
        let allIndices = [];
        let totalScore = 0;

        // ORs
        for (let i = 0, qLen = query.length; i < qLen; i += 1) {
          const searchers = query[i];

          // Reset indices
          allIndices.length = 0;
          numMatches = 0;

          // ANDs
          for (let j = 0, pLen = searchers.length; j < pLen; j += 1) {
            const searcher = searchers[j];
            const { isMatch, indices, score } = searcher.search(text);

            if (isMatch) {
              numMatches += 1;
              totalScore += score;
              if (includeMatches) {
                const type = searcher.constructor.type;
                if (MultiMatchSet.has(type)) {
                  allIndices = [...allIndices, ...indices];
                } else {
                  allIndices.push(indices);
                }
              }
            } else {
              totalScore = 0;
              numMatches = 0;
              allIndices.length = 0;
              break
            }
          }

          // OR condition, so if TRUE, return
          if (numMatches) {
            let result = {
              isMatch: true,
              score: totalScore / numMatches
            };

            if (includeMatches) {
              result.indices = allIndices;
            }

            return result
          }
        }

        // Nothing was matched
        return {
          isMatch: false,
          score: 1
        }
      }
    }

    const registeredSearchers = [];

    function register(...args) {
      registeredSearchers.push(...args);
    }

    function createSearcher(pattern, options) {
      for (let i = 0, len = registeredSearchers.length; i < len; i += 1) {
        let searcherClass = registeredSearchers[i];
        if (searcherClass.condition(pattern, options)) {
          return new searcherClass(pattern, options)
        }
      }

      return new BitapSearch(pattern, options)
    }

    const LogicalOperator = {
      AND: '$and',
      OR: '$or'
    };

    const KeyType = {
      PATH: '$path',
      PATTERN: '$val'
    };

    const isExpression = (query) =>
      !!(query[LogicalOperator.AND] || query[LogicalOperator.OR]);

    const isPath = (query) => !!query[KeyType.PATH];

    const isLeaf = (query) =>
      !isArray(query) && isObject(query) && !isExpression(query);

    const convertToExplicit = (query) => ({
      [LogicalOperator.AND]: Object.keys(query).map((key) => ({
        [key]: query[key]
      }))
    });

    // When `auto` is `true`, the parse function will infer and initialize and add
    // the appropriate `Searcher` instance
    function parse(query, options, { auto = true } = {}) {
      const next = (query) => {
        let keys = Object.keys(query);

        const isQueryPath = isPath(query);

        if (!isQueryPath && keys.length > 1 && !isExpression(query)) {
          return next(convertToExplicit(query))
        }

        if (isLeaf(query)) {
          const key = isQueryPath ? query[KeyType.PATH] : keys[0];

          const pattern = isQueryPath ? query[KeyType.PATTERN] : query[key];

          if (!isString(pattern)) {
            throw new Error(LOGICAL_SEARCH_INVALID_QUERY_FOR_KEY(key))
          }

          const obj = {
            keyId: createKeyId(key),
            pattern
          };

          if (auto) {
            obj.searcher = createSearcher(pattern, options);
          }

          return obj
        }

        let node = {
          children: [],
          operator: keys[0]
        };

        keys.forEach((key) => {
          const value = query[key];

          if (isArray(value)) {
            value.forEach((item) => {
              node.children.push(next(item));
            });
          }
        });

        return node
      };

      if (!isExpression(query)) {
        query = convertToExplicit(query);
      }

      return next(query)
    }

    // Practical scoring function
    function computeScore(
      results,
      { ignoreFieldNorm = Config.ignoreFieldNorm }
    ) {
      results.forEach((result) => {
        let totalScore = 1;

        result.matches.forEach(({ key, norm, score }) => {
          const weight = key ? key.weight : null;

          totalScore *= Math.pow(
            score === 0 && weight ? Number.EPSILON : score,
            (weight || 1) * (ignoreFieldNorm ? 1 : norm)
          );
        });

        result.score = totalScore;
      });
    }

    function transformMatches(result, data) {
      const matches = result.matches;
      data.matches = [];

      if (!isDefined(matches)) {
        return
      }

      matches.forEach((match) => {
        if (!isDefined(match.indices) || !match.indices.length) {
          return
        }

        const { indices, value } = match;

        let obj = {
          indices,
          value
        };

        if (match.key) {
          obj.key = match.key.src;
        }

        if (match.idx > -1) {
          obj.refIndex = match.idx;
        }

        data.matches.push(obj);
      });
    }

    function transformScore(result, data) {
      data.score = result.score;
    }

    function format(
      results,
      docs,
      {
        includeMatches = Config.includeMatches,
        includeScore = Config.includeScore
      } = {}
    ) {
      const transformers = [];

      if (includeMatches) transformers.push(transformMatches);
      if (includeScore) transformers.push(transformScore);

      return results.map((result) => {
        const { idx } = result;

        const data = {
          item: docs[idx],
          refIndex: idx
        };

        if (transformers.length) {
          transformers.forEach((transformer) => {
            transformer(result, data);
          });
        }

        return data
      })
    }

    class Fuse {
      constructor(docs, options = {}, index) {
        this.options = { ...Config, ...options };

        if (
          this.options.useExtendedSearch &&
          !true
        ) {
          throw new Error(EXTENDED_SEARCH_UNAVAILABLE)
        }

        this._keyStore = new KeyStore(this.options.keys);

        this.setCollection(docs, index);
      }

      setCollection(docs, index) {
        this._docs = docs;

        if (index && !(index instanceof FuseIndex)) {
          throw new Error(INCORRECT_INDEX_TYPE)
        }

        this._myIndex =
          index ||
          createIndex(this.options.keys, this._docs, {
            getFn: this.options.getFn,
            fieldNormWeight: this.options.fieldNormWeight
          });
      }

      add(doc) {
        if (!isDefined(doc)) {
          return
        }

        this._docs.push(doc);
        this._myIndex.add(doc);
      }

      remove(predicate = (/* doc, idx */) => false) {
        const results = [];

        for (let i = 0, len = this._docs.length; i < len; i += 1) {
          const doc = this._docs[i];
          if (predicate(doc, i)) {
            this.removeAt(i);
            i -= 1;
            len -= 1;

            results.push(doc);
          }
        }

        return results
      }

      removeAt(idx) {
        this._docs.splice(idx, 1);
        this._myIndex.removeAt(idx);
      }

      getIndex() {
        return this._myIndex
      }

      search(query, { limit = -1 } = {}) {
        const {
          includeMatches,
          includeScore,
          shouldSort,
          sortFn,
          ignoreFieldNorm
        } = this.options;

        let results = isString(query)
          ? isString(this._docs[0])
            ? this._searchStringList(query)
            : this._searchObjectList(query)
          : this._searchLogical(query);

        computeScore(results, { ignoreFieldNorm });

        if (shouldSort) {
          results.sort(sortFn);
        }

        if (isNumber(limit) && limit > -1) {
          results = results.slice(0, limit);
        }

        return format(results, this._docs, {
          includeMatches,
          includeScore
        })
      }

      _searchStringList(query) {
        const searcher = createSearcher(query, this.options);
        const { records } = this._myIndex;
        const results = [];

        // Iterate over every string in the index
        records.forEach(({ v: text, i: idx, n: norm }) => {
          if (!isDefined(text)) {
            return
          }

          const { isMatch, score, indices } = searcher.searchIn(text);

          if (isMatch) {
            results.push({
              item: text,
              idx,
              matches: [{ score, value: text, norm, indices }]
            });
          }
        });

        return results
      }

      _searchLogical(query) {

        const expression = parse(query, this.options);

        const evaluate = (node, item, idx) => {
          if (!node.children) {
            const { keyId, searcher } = node;

            const matches = this._findMatches({
              key: this._keyStore.get(keyId),
              value: this._myIndex.getValueForItemAtKeyId(item, keyId),
              searcher
            });

            if (matches && matches.length) {
              return [
                {
                  idx,
                  item,
                  matches
                }
              ]
            }

            return []
          }

          const res = [];
          for (let i = 0, len = node.children.length; i < len; i += 1) {
            const child = node.children[i];
            const result = evaluate(child, item, idx);
            if (result.length) {
              res.push(...result);
            } else if (node.operator === LogicalOperator.AND) {
              return []
            }
          }
          return res
        };

        const records = this._myIndex.records;
        const resultMap = {};
        const results = [];

        records.forEach(({ $: item, i: idx }) => {
          if (isDefined(item)) {
            let expResults = evaluate(expression, item, idx);

            if (expResults.length) {
              // Dedupe when adding
              if (!resultMap[idx]) {
                resultMap[idx] = { idx, item, matches: [] };
                results.push(resultMap[idx]);
              }
              expResults.forEach(({ matches }) => {
                resultMap[idx].matches.push(...matches);
              });
            }
          }
        });

        return results
      }

      _searchObjectList(query) {
        const searcher = createSearcher(query, this.options);
        const { keys, records } = this._myIndex;
        const results = [];

        // List is Array<Object>
        records.forEach(({ $: item, i: idx }) => {
          if (!isDefined(item)) {
            return
          }

          let matches = [];

          // Iterate over every key (i.e, path), and fetch the value at that key
          keys.forEach((key, keyIndex) => {
            matches.push(
              ...this._findMatches({
                key,
                value: item[keyIndex],
                searcher
              })
            );
          });

          if (matches.length) {
            results.push({
              idx,
              item,
              matches
            });
          }
        });

        return results
      }
      _findMatches({ key, value, searcher }) {
        if (!isDefined(value)) {
          return []
        }

        let matches = [];

        if (isArray(value)) {
          value.forEach(({ v: text, i: idx, n: norm }) => {
            if (!isDefined(text)) {
              return
            }

            const { isMatch, score, indices } = searcher.searchIn(text);

            if (isMatch) {
              matches.push({
                score,
                key,
                value: text,
                idx,
                norm,
                indices
              });
            }
          });
        } else {
          const { v: text, n: norm } = value;

          const { isMatch, score, indices } = searcher.searchIn(text);

          if (isMatch) {
            matches.push({ score, key, value: text, norm, indices });
          }
        }

        return matches
      }
    }

    Fuse.version = '6.5.3';
    Fuse.createIndex = createIndex;
    Fuse.parseIndex = parseIndex;
    Fuse.config = Config;

    {
      Fuse.parseQuery = parse;
    }

    {
      register(ExtendedSearch);
    }

    var css_248z$3 = "";
    styleInject(css_248z$3);

    /* src\SearchPanel.svelte generated by Svelte v3.46.2 */

    const { Object: Object_1 } = globals;
    const file$4 = "src\\SearchPanel.svelte";

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[10] = list[i];
    	child_ctx[12] = i;
    	return child_ctx;
    }

    // (33:1) <Field label='Item Search'>
    function create_default_slot$1(ctx) {
    	let input;
    	let updating_value;
    	let current;

    	function input_value_binding(value) {
    		/*input_value_binding*/ ctx[3](value);
    	}

    	let input_props = {
    		placeholder: /*randomItem*/ ctx[2]().name
    	};

    	if (/*searchText*/ ctx[0] !== void 0) {
    		input_props.value = /*searchText*/ ctx[0];
    	}

    	input = new Input({ props: input_props, $$inline: true });
    	binding_callbacks.push(() => bind(input, 'value', input_value_binding));

    	const block = {
    		c: function create() {
    			create_component(input.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const input_changes = {};

    			if (!updating_value && dirty & /*searchText*/ 1) {
    				updating_value = true;
    				input_changes.value = /*searchText*/ ctx[0];
    				add_flush_callback(() => updating_value = false);
    			}

    			input.$set(input_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(input, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(33:1) <Field label='Item Search'>",
    		ctx
    	});

    	return block;
    }

    // (39:1) {#each $SLOTS['search'] as item, idx}
    function create_each_block$2(ctx) {
    	let div;
    	let itemslot;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	itemslot = new ItemSlot({
    			props: {
    				container: "search",
    				itemID: /*item*/ ctx[10],
    				slotID: /*idx*/ ctx[12]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(itemslot.$$.fragment);
    			t = space();
    			add_location(div, file$4, 39, 2, 969);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(itemslot, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					action_destroyer(itemContainer.call(null, div)),
    					listen_dev(div, "drop", /*drop_handler*/ ctx[4], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			const itemslot_changes = {};
    			if (dirty & /*$SLOTS*/ 2) itemslot_changes.itemID = /*item*/ ctx[10];
    			itemslot.$set(itemslot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemslot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemslot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(itemslot);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$2.name,
    		type: "each",
    		source: "(39:1) {#each $SLOTS['search'] as item, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div0;
    	let field;
    	let t;
    	let div1;
    	let current;

    	field = new Field({
    			props: {
    				label: "Item Search",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let each_value = /*$SLOTS*/ ctx[1]['search'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			create_component(field.$$.fragment);
    			t = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div0, "class", "section");
    			add_location(div0, file$4, 31, 0, 773);
    			attr_dev(div1, "class", "grid svelte-3ye1cd");
    			add_location(div1, file$4, 37, 0, 909);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			mount_component(field, div0, null);
    			insert_dev(target, t, anchor);
    			insert_dev(target, div1, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const field_changes = {};

    			if (dirty & /*$$scope, searchText*/ 8193) {
    				field_changes.$$scope = { dirty, ctx };
    			}

    			field.$set(field_changes);

    			if (dirty & /*$SLOTS*/ 2) {
    				each_value = /*$SLOTS*/ ctx[1]['search'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(field.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(field.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div0);
    			destroy_component(field);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$5($$self, $$props, $$invalidate) {
    	let $SLOTS;
    	let $ITEM_MAP;
    	validate_store(SLOTS, 'SLOTS');
    	component_subscribe($$self, SLOTS, $$value => $$invalidate(1, $SLOTS = $$value));
    	validate_store(ITEM_MAP, 'ITEM_MAP');
    	component_subscribe($$self, ITEM_MAP, $$value => $$invalidate(5, $ITEM_MAP = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('SearchPanel', slots, []);
    	set_store_value(SLOTS, $SLOTS['search'] = [], $SLOTS);
    	const data = Object.values($ITEM_MAP).filter(item => !item.duplicate && item.type == 'normal');
    	const randomItem = () => data[Math.floor(Math.random() * data.length)];
    	const fuse = new Fuse(data, { keys: ['name'] });

    	const updateSlots = result => {
    		if (!result) return;
    		set_store_value(SLOTS, $SLOTS['search'] = [], $SLOTS);
    		for (var i = 0; i < result.length; i++) $SLOTS['search'].push(result[i].item.id);
    	};

    	const search = text => {
    		updateSlots(fuse.search(text, { limit: 50 }));
    	};

    	let searchText = '';
    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<SearchPanel> was created with unknown prop '${key}'`);
    	});

    	function input_value_binding(value) {
    		searchText = value;
    		$$invalidate(0, searchText);
    	}

    	const drop_handler = e => {
    		if (e.detail.source != "search") set_store_value(SLOTS, $SLOTS[e.detail.source][e.detail.slotID] = -1, $SLOTS);
    	};

    	$$self.$capture_state = () => ({
    		Field,
    		Input,
    		ItemSlot,
    		ITEM_MAP,
    		SLOTS,
    		itemContainer,
    		Fuse,
    		data,
    		randomItem,
    		fuse,
    		updateSlots,
    		search,
    		searchText,
    		$SLOTS,
    		$ITEM_MAP
    	});

    	$$self.$inject_state = $$props => {
    		if ('searchText' in $$props) $$invalidate(0, searchText = $$props.searchText);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*searchText*/ 1) {
    			search(searchText);
    		}
    	};

    	return [searchText, $SLOTS, randomItem, input_value_binding, drop_handler];
    }

    class SearchPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "SearchPanel",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    var css_248z$2 = "";
    styleInject(css_248z$2);

    /* src\ItemGrid.svelte generated by Svelte v3.46.2 */
    const file$3 = "src\\ItemGrid.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	child_ctx[5] = i;
    	return child_ctx;
    }

    // (10:1) {#each $SLOTS['grid'] as item, idx}
    function create_each_block$1(ctx) {
    	let div;
    	let itemslot;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	itemslot = new ItemSlot({
    			props: {
    				container: "grid",
    				itemID: /*item*/ ctx[3],
    				slotID: /*idx*/ ctx[5]
    			},
    			$$inline: true
    		});

    	function contextmenu_handler(...args) {
    		return /*contextmenu_handler*/ ctx[1](/*idx*/ ctx[5], ...args);
    	}

    	function drop_handler(...args) {
    		return /*drop_handler*/ ctx[2](/*item*/ ctx[3], /*idx*/ ctx[5], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(itemslot.$$.fragment);
    			t = space();
    			add_location(div, file$3, 10, 2, 246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(itemslot, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "contextmenu", prevent_default(contextmenu_handler), false, true, false),
    					action_destroyer(itemContainer.call(null, div, {})),
    					listen_dev(div, "drop", drop_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const itemslot_changes = {};
    			if (dirty & /*$SLOTS*/ 1) itemslot_changes.itemID = /*item*/ ctx[3];
    			itemslot.$set(itemslot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemslot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemslot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(itemslot);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(10:1) {#each $SLOTS['grid'] as item, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current;
    	let each_value = /*$SLOTS*/ ctx[0]['grid'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid svelte-5w1zcd");
    			add_location(div, file$3, 8, 0, 188);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$SLOTS*/ 1) {
    				each_value = /*$SLOTS*/ ctx[0]['grid'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$4($$self, $$props, $$invalidate) {
    	let $SLOTS;
    	validate_store(SLOTS, 'SLOTS');
    	component_subscribe($$self, SLOTS, $$value => $$invalidate(0, $SLOTS = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemGrid', slots, []);
    	set_store_value(SLOTS, $SLOTS['grid'] = new Array(16 * 8).fill(-1), $SLOTS);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemGrid> was created with unknown prop '${key}'`);
    	});

    	const contextmenu_handler = (idx, e) => {
    		set_store_value(SLOTS, $SLOTS['grid'][idx] = -1, $SLOTS);
    	};

    	const drop_handler = (item, idx, e) => {
    		if (e.detail.source == "grid") set_store_value(SLOTS, $SLOTS['grid'][e.detail.slotID] = item, $SLOTS);
    		set_store_value(SLOTS, $SLOTS['grid'][idx] = e.detail.itemID, $SLOTS);
    	};

    	$$self.$capture_state = () => ({ ItemSlot, itemContainer, SLOTS, $SLOTS });
    	return [$SLOTS, contextmenu_handler, drop_handler];
    }

    class ItemGrid extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemGrid",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    var css_248z$1 = "";
    styleInject(css_248z$1);

    /* src\ItemList.svelte generated by Svelte v3.46.2 */
    const file$2 = "src\\ItemList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[8] = list[i];
    	child_ctx[10] = i;
    	return child_ctx;
    }

    // (44:1) {#each $SLOTS['items'] as item, idx}
    function create_each_block(ctx) {
    	let div;
    	let itemslot;
    	let t;
    	let current;
    	let mounted;
    	let dispose;

    	itemslot = new ItemSlot({
    			props: {
    				container: "items",
    				itemID: /*item*/ ctx[8],
    				slotID: /*idx*/ ctx[10],
    				background: false
    			},
    			$$inline: true
    		});

    	function contextmenu_handler(...args) {
    		return /*contextmenu_handler*/ ctx[3](/*idx*/ ctx[10], ...args);
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			create_component(itemslot.$$.fragment);
    			t = space();
    			add_location(div, file$2, 44, 2, 1140);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			mount_component(itemslot, div, null);
    			append_dev(div, t);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div, "contextmenu", prevent_default(contextmenu_handler), false, true, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			const itemslot_changes = {};
    			if (dirty & /*$SLOTS*/ 2) itemslot_changes.itemID = /*item*/ ctx[8];
    			itemslot.$set(itemslot_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemslot.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemslot.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(itemslot);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(44:1) {#each $SLOTS['items'] as item, idx}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let current;
    	let mounted;
    	let dispose;
    	let each_value = /*$SLOTS*/ ctx[1]['items'];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	const block = {
    		c: function create() {
    			div = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(div, "class", "grid svelte-1c0gozd");
    			set_style(div, "background-color", /*highlighted*/ ctx[0] ? highlightColor : bgColor);
    			add_location(div, file$2, 35, 0, 836);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(div, "mouseenter", /*mouseenter_handler*/ ctx[4], false, false, false),
    					listen_dev(div, "mouseleave", /*mouseleave_handler*/ ctx[5], false, false, false),
    					action_destroyer(itemContainer.call(null, div, {})),
    					listen_dev(div, "drop", /*drop_handler*/ ctx[6], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$SLOTS*/ 2) {
    				each_value = /*$SLOTS*/ ctx[1]['items'];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (!current || dirty & /*highlighted*/ 1) {
    				set_style(div, "background-color", /*highlighted*/ ctx[0] ? highlightColor : bgColor);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    const bgColor = "rgb(63, 63, 63)", highlightColor = "rgb(102, 102, 102)";

    function instance$3($$self, $$props, $$invalidate) {
    	let $SLOTS;
    	validate_store(SLOTS, 'SLOTS');
    	component_subscribe($$self, SLOTS, $$value => $$invalidate(1, $SLOTS = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('ItemList', slots, []);
    	set_store_value(SLOTS, $SLOTS['items'] = new Array(16 * 8).fill(-1), $SLOTS);
    	set_store_value(SLOTS, $SLOTS['taggedItems'] = [], $SLOTS);
    	let { highlighted = false } = $$props;

    	const addItem = id => {
    		set_store_value(SLOTS, $SLOTS['taggedItems'] = [...new Set([...$SLOTS['taggedItems'], id])], $SLOTS);
    		if (!$SLOTS['grid']) set_store_value(SLOTS, $SLOTS['grid'] = [], $SLOTS);
    		var all_items_set = new Set([...$SLOTS['grid'], ...$SLOTS['taggedItems']]);
    		all_items_set.delete(-1);
    		var all_items = [...all_items_set];
    		$SLOTS['items'].fill(-1);
    		for (var i = 0; i < all_items.length; i++) set_store_value(SLOTS, $SLOTS['items'][i] = all_items[i], $SLOTS);
    	};

    	const onUpdate = (...args) => {
    		addItem(-1);
    	};

    	const writable_props = ['highlighted'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<ItemList> was created with unknown prop '${key}'`);
    	});

    	const contextmenu_handler = (idx, e) => {
    		set_store_value(SLOTS, $SLOTS['items'][idx] = -1, $SLOTS);
    	};

    	const mouseenter_handler = e => {
    		$$invalidate(0, highlighted = true);
    	};

    	const mouseleave_handler = e => {
    		$$invalidate(0, highlighted = false);
    	};

    	const drop_handler = e => {
    		addItem(e.detail.itemID);
    	};

    	$$self.$$set = $$props => {
    		if ('highlighted' in $$props) $$invalidate(0, highlighted = $$props.highlighted);
    	};

    	$$self.$capture_state = () => ({
    		ItemSlot,
    		itemContainer,
    		SLOTS,
    		bgColor,
    		highlightColor,
    		highlighted,
    		addItem,
    		onUpdate,
    		$SLOTS
    	});

    	$$self.$inject_state = $$props => {
    		if ('highlighted' in $$props) $$invalidate(0, highlighted = $$props.highlighted);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$SLOTS*/ 2) {
    			onUpdate($SLOTS['items'], $SLOTS['grid']);
    		}
    	};

    	return [
    		highlighted,
    		$SLOTS,
    		addItem,
    		contextmenu_handler,
    		mouseenter_handler,
    		mouseleave_handler,
    		drop_handler
    	];
    }

    class ItemList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, { highlighted: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ItemList",
    			options,
    			id: create_fragment$3.name
    		});
    	}

    	get highlighted() {
    		throw new Error("<ItemList>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set highlighted(value) {
    		throw new Error("<ItemList>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var css_248z = "";
    styleInject(css_248z);

    /* src\LayoutPanel.svelte generated by Svelte v3.46.2 */

    // (10:1) <Tab label='Tag' icon='tag'>
    function create_default_slot_2(ctx) {
    	let itemlist;
    	let current;
    	itemlist = new ItemList({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(itemlist.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemlist, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemlist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemlist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemlist, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(10:1) <Tab label='Tag' icon='tag'>",
    		ctx
    	});

    	return block;
    }

    // (14:1) <Tab label='Layout' icon='th-large'>
    function create_default_slot_1(ctx) {
    	let itemgrid;
    	let current;
    	itemgrid = new ItemGrid({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(itemgrid.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(itemgrid, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(itemgrid.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(itemgrid.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(itemgrid, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(14:1) <Tab label='Layout' icon='th-large'>",
    		ctx
    	});

    	return block;
    }

    // (9:0) <Tabs bind:active style="is-fullwidth">
    function create_default_slot(ctx) {
    	let tab0;
    	let t;
    	let tab1;
    	let current;

    	tab0 = new Tab({
    			props: {
    				label: "Tag",
    				icon: "tag",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	tab1 = new Tab({
    			props: {
    				label: "Layout",
    				icon: "th-large",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tab0.$$.fragment);
    			t = space();
    			create_component(tab1.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(tab0, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(tab1, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const tab0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				tab0_changes.$$scope = { dirty, ctx };
    			}

    			tab0.$set(tab0_changes);
    			const tab1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				tab1_changes.$$scope = { dirty, ctx };
    			}

    			tab1.$set(tab1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tab0.$$.fragment, local);
    			transition_in(tab1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tab0.$$.fragment, local);
    			transition_out(tab1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tab0, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(tab1, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(9:0) <Tabs bind:active style=\\\"is-fullwidth\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let tabs;
    	let updating_active;
    	let current;

    	function tabs_active_binding(value) {
    		/*tabs_active_binding*/ ctx[1](value);
    	}

    	let tabs_props = {
    		style: "is-fullwidth",
    		$$slots: { default: [create_default_slot] },
    		$$scope: { ctx }
    	};

    	if (/*active*/ ctx[0] !== void 0) {
    		tabs_props.active = /*active*/ ctx[0];
    	}

    	tabs = new Tabs({ props: tabs_props, $$inline: true });
    	binding_callbacks.push(() => bind(tabs, 'active', tabs_active_binding));

    	const block = {
    		c: function create() {
    			create_component(tabs.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tabs, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const tabs_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				tabs_changes.$$scope = { dirty, ctx };
    			}

    			if (!updating_active && dirty & /*active*/ 1) {
    				updating_active = true;
    				tabs_changes.active = /*active*/ ctx[0];
    				add_flush_callback(() => updating_active = false);
    			}

    			tabs.$set(tabs_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tabs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tabs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tabs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('LayoutPanel', slots, []);
    	let active = 1;
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<LayoutPanel> was created with unknown prop '${key}'`);
    	});

    	function tabs_active_binding(value) {
    		active = value;
    		$$invalidate(0, active);
    	}

    	$$self.$capture_state = () => ({ ItemGrid, ItemList, Tabs, Tab, active });

    	$$self.$inject_state = $$props => {
    		if ('active' in $$props) $$invalidate(0, active = $$props.active);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [active, tabs_active_binding];
    }

    class LayoutPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "LayoutPanel",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\MainPanel.svelte generated by Svelte v3.46.2 */
    const file$1 = "src\\MainPanel.svelte";

    function create_fragment$1(ctx) {
    	let div2;
    	let div0;
    	let settingspanel;
    	let t0;
    	let searchpanel;
    	let t1;
    	let div1;
    	let layoutpanel;
    	let current;
    	settingspanel = new SettingsPanel({ $$inline: true });
    	searchpanel = new SearchPanel({ $$inline: true });
    	layoutpanel = new LayoutPanel({ $$inline: true });

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			div0 = element("div");
    			create_component(settingspanel.$$.fragment);
    			t0 = space();
    			create_component(searchpanel.$$.fragment);
    			t1 = space();
    			div1 = element("div");
    			create_component(layoutpanel.$$.fragment);
    			attr_dev(div0, "class", "column is-two-fifths");
    			add_location(div0, file$1, 8, 1, 222);
    			attr_dev(div1, "class", "column");
    			add_location(div1, file$1, 14, 1, 305);
    			attr_dev(div2, "class", "columns");
    			add_location(div2, file$1, 7, 0, 199);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div0);
    			mount_component(settingspanel, div0, null);
    			append_dev(div0, t0);
    			mount_component(searchpanel, div0, null);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			mount_component(layoutpanel, div1, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(settingspanel.$$.fragment, local);
    			transition_in(searchpanel.$$.fragment, local);
    			transition_in(layoutpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(settingspanel.$$.fragment, local);
    			transition_out(searchpanel.$$.fragment, local);
    			transition_out(layoutpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			destroy_component(settingspanel);
    			destroy_component(searchpanel);
    			destroy_component(layoutpanel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('MainPanel', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<MainPanel> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ SettingsPanel, SearchPanel, LayoutPanel });
    	return [];
    }

    class MainPanel extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MainPanel",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.2 */
    const file = "src\\App.svelte";

    // (22:1) {:catch error}
    function create_catch_block(ctx) {
    	let t0;
    	let t1_value = JSON.stringify(/*error*/ ctx[2]) + "";
    	let t1;
    	let t2;

    	const block = {
    		c: function create() {
    			t0 = text("There was an error: ");
    			t1 = text(t1_value);
    			t2 = text(".");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t0, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, t2, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(t2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_catch_block.name,
    		type: "catch",
    		source: "(22:1) {:catch error}",
    		ctx
    	});

    	return block;
    }

    // (15:1) {:then items}
    function create_then_block(ctx) {
    	let div1;
    	let div0;
    	let mainpanel;
    	let current;
    	mainpanel = new MainPanel({ $$inline: true });

    	const block = {
    		c: function create() {
    			div1 = element("div");
    			div0 = element("div");
    			create_component(mainpanel.$$.fragment);
    			attr_dev(div0, "class", "container");
    			add_location(div0, file, 16, 3, 305);
    			attr_dev(div1, "class", "section");
    			add_location(div1, file, 15, 2, 280);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			mount_component(mainpanel, div0, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(mainpanel.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(mainpanel.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_component(mainpanel);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_then_block.name,
    		type: "then",
    		source: "(15:1) {:then items}",
    		ctx
    	});

    	return block;
    }

    // (13:17)    Loading...  {:then items}
    function create_pending_block(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Loading...");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		p: noop,
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_pending_block.name,
    		type: "pending",
    		source: "(13:17)    Loading...  {:then items}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let await_block_anchor;
    	let current;

    	let info = {
    		ctx,
    		current: null,
    		token: null,
    		hasCatch: true,
    		pending: create_pending_block,
    		then: create_then_block,
    		catch: create_catch_block,
    		value: 1,
    		error: 2,
    		blocks: [,,,]
    	};

    	handle_promise(/*promise*/ ctx[0], info);

    	const block = {
    		c: function create() {
    			await_block_anchor = empty();
    			info.block.c();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, await_block_anchor, anchor);
    			info.block.m(target, info.anchor = anchor);
    			info.mount = () => await_block_anchor.parentNode;
    			info.anchor = await_block_anchor;
    			current = true;
    		},
    		p: function update(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			update_await_block_branch(info, ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(info.block);
    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < 3; i += 1) {
    				const block = info.blocks[i];
    				transition_out(block);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(await_block_anchor);
    			info.block.d(detaching);
    			info.token = null;
    			info = null;
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	const promise = getItems();
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ getItems, promise, MainPanel });
    	return [promise];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
