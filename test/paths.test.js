"use strict";
import { expect } from "chai";
import crypto from "crypto";
import fs from "fs-extra";
import fsPath from "path";
import css from "../src";
const SAMPLES_PATH = "./test/samples"


describe("paths", function() {
  describe("paths param", function() {
    it("throws if not path was given", () => {
      expect(() => css.compile()).to.throw();
    });

    it("converts single path to an array", () => {
      const path = `${ SAMPLES_PATH }/css`;
      const compiler = css.compile(path);
      expect(compiler.paths.length).to.equal(1);
      expect(compiler.paths[0]).to.equal(fsPath.resolve(path));
    });

    it("throws if a path does not exist", () => {
      expect(() => css.compile("./foo")).to.throw();
    });

    it("does not have the same path more than once", () => {
      const compiler = css.compile([`${ SAMPLES_PATH }/css`, null, undefined, `${ SAMPLES_PATH }/css`]);
      expect(compiler.paths.length).to.equal(1);
    });

    it("flattens paths", () => {
      const path = `${ SAMPLES_PATH }/css`;
      const compiler = css.compile([[[path]]]);
      expect(compiler.paths.length).to.equal(1);
      expect(compiler.paths[0]).to.equal(fsPath.resolve(path));
    });
  });


  describe("files", function() {
    it("has no source files", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/empty`);
      expect(compiler.paths.files).to.eql([]);
    });

    it("has [.css] and [.styl] file paths (deep)", () => {
      const compiler = css.compile(`${ SAMPLES_PATH }/css`);
      const files = compiler.paths.files;
      expect(files).to.include(fsPath.resolve(SAMPLES_PATH, "css/common.mixin.styl"));
      expect(files).to.include(fsPath.resolve(SAMPLES_PATH, "css/mixin.styl"));
      expect(files).to.include(fsPath.resolve(SAMPLES_PATH, "css/normalize.css"));
      expect(files).to.include(fsPath.resolve(SAMPLES_PATH, "css/child/child.styl"));
    });

    it("does not have non-CSS files", () => {
      const compiler = css.compile(SAMPLES_PATH);
      const files = compiler.paths.files;
      expect(files).not.to.include(fsPath.resolve(SAMPLES_PATH, ".foo"));
      expect(files).not.to.include(fsPath.resolve(SAMPLES_PATH, "foo.js"));
    });
  });
});
