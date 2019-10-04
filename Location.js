var PopupWindow = android.widget.PopupWindow;
var LinearLayout = android.widget.LinearLayout;
var Button = android.widget.Button;
var EditText = android.widget.EditText;
var TextView = android.widget.TextView;
var ImageView = android.widget.ImageView
var Toast = android.widget.Toast;

var Dialog = android.app.Dialog;
var AlertDialog = android.app.AlertDialog;

var View = android.view.View;
var MotionEvent = android.view.MotionEvent
var Gravity = android.view.Gravity;
var RotateAnimation = android.view.animation.RotateAnimation;

var Color = android.graphics.Color;
var Bitmap = android.graphics.Bitmap;
var Canvas = android.graphics.Canvas;
var Paint = android.graphics.Paint;

var TextWatcher = android.text.TextWatcher

var DialogInterface = android.content.DialogInterface;

var ctx = com.mojang.minecraftpe.MainActivity.currentMainActivity.get();

var Thread = java.lang.Thread;

var ui = function(func){ctx.runOnUiThread(new java.lang.Runnable(){run: func});};
var dp = function(dips){return Math.ceil(dips * ctx.getResources().getDisplayMetrics().density);};
var ts = function(mesg){ui(function(){Toast.makeText(ctx,mesg,1).show();});};

var btnWindow = null;
var dgrWindow = null;
var locWindow = null;
var dgr = null;
var loc = null;
var isVisible = false;
var resource = ctx.getResources().getDisplayMetrics();
var Device = {
	width: resource.widthPixels,
	height: resource.heightPixels
};
var Degree = {
	on: Bitmap.createBitmap(Device.height/3, Device.height/3, Bitmap.Config.ARGB_8888),
	off: Bitmap.createBitmap(Device.height/3, Device.height/3, Bitmap.Config.ARGB_8888)
};
var Option = {
	size: 12,
	color: Color.WHITE,
	shadow: Color.BLACK
};
var Toggle = {
	xyz: true,
	facing: true,
	biome: true
};

var paint = new Paint();
paint.setAntiAlias(true);
paint.setColor(Color.parseColor("#00e676"));
paint.setStyle(Paint.Style.STROKE);
paint.setStrokeWidth(Device.height/9);
var canvas = new Canvas(Degree.off);
canvas.drawCircle(0, Device.height/3, Device.height*(5/18), paint);
paint.setColor(Color.parseColor("#00C853"));
canvas = new Canvas(Degree.on);
canvas.drawCircle(0, Device.height/3, Device.height*(5/18), paint);

function newLevel(){
    /*if(ModPE.readData("LC1_start") != "Location_1.0 - 여흥"){
        ModPE.saveData("LC1_start","Location_1.0 - 여흥");
        ModPE.saveData("LC1_x",LC1_x);
        ModPE.saveData("LC1_y",LC1_y);
        makeBtn();
    } else {
        LC1_x = parseInt(ModPE.readData("LC1_x"));
        LC1_y = parseInt(ModPE.readData("LC1_y"));
        makeBtn();
    }*/
	makeDegree();
	makeBtn();
	makeLocation();
}

function leaveGame(){
	isVisible = false;
  ui(function(){
    if(btnWindow != null){
      btnWindow.dismiss();
      btnWindow = null;
    }
    if(dgrWindow != null){
      dgrWindow.dismiss();
      dgrWindow = null;
    }
    if(locWindow != null){
      locWindow.dismiss();
      locWindow = null;
  });
}

function makeBtn(){
	ui(function(){
		try{
			var btn = new Button(ctx);
			var viewX,viewY,x,y,xx,yy;
			var click = true;
			btn.setOnTouchListener(new View.OnTouchListener({
				onTouch: function(v, event) {
					switch(event.action) {
						case MotionEvent.ACTION_DOWN:
							viewX = event.getX();
							viewY = event.getY();
							xx = event.getRawX() - viewX;
							yy = event.getRawY() - viewY;
							break;
						case MotionEvent.ACTION_MOVE:
							x = event.getRawX() - viewX;
							y = event.getRawY() - viewY;
							if(Math.abs(x-xx) > 10 || Math.abs(y-yy) > 10) click = false;
							if(!click){
								if(dgr.getVisibility()==View.INVISIBLE) dgr.setVisibility(View.VISIBLE);
								var distance = Math.sqrt((x*x)+((Device.height-y)*(Device.height-y)));
								if(distance>(Device.height*(2/9)) && distance<(Device.height/3)) dgr.setImageBitmap(Degree.on);
								else dgr.setImageBitmap(Degree.off);
								btnWindow.update(x,Device.height-y-dp(40),dp(40),dp(40),true);
							}
							break;
						case MotionEvent.ACTION_UP:
							if(click){
								if(isVisible){
									isVisible = false;
									loc.setVisibility(View.INVISIBLE);
								}else{
									isVisible = true;
									loc.setVisibility(View.VISIBLE);
								}
							}else{
								click = true;
								if(dgr.getVisibility()==View.VISIBLE) dgr.setVisibility(View.INVISIBLE);
								btnWindow.update(dp(10),dp(10),dp(40),dp(40),true);
							}
							break;
					}
					return false;
				}
			}));
			btnWindow = new PopupWindow(btn, dp(40), dp(40));
			btnWindow.showAtLocation(ctx.getWindow().getDecorView(), Gravity.LEFT|Gravity.BOTTOM, dp(10), dp(10));
		}catch(err){
			print("load btn " + err.lineNumber + "\n" + err);
		}
	});
}

function makeDegree(){
	ui(function(){
		try{
			dgr = new ImageView(ctx);
			dgr.setImageBitmap(Degree.off);
			dgr.setVisibility(View.INVISIBLE);
			dgrWindow = new PopupWindow(dgr, Device.height/3, Device.height/3);
			dgrWindow.setTouchable(false);
			dgrWindow.showAtLocation(ctx.getWindow().getDecorView(), Gravity.LEFT|Gravity.BOTTOM, 0, 0);
		}catch(err){
			print("load degree " + err.lineNumber + "\n" + err);
		}
	});
}

function makeLocation(){
	ui(function(){
		try{
			loc = new TextView(ctx);
			loc.setTextColor(Color.WHITE);
			loc.setVisibility(View.INVISIBLE);
			locWindow = new PopupWindow(loc, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT, android.widget.LinearLayout.LayoutParams.WRAP_CONTENT);
			locWindow.setTouchable(false);
			locWindow.showAtLocation(ctx.getWindow().getDecorView(), Gravity.LEFT|Gravity.TOP, dp(10), dp(10));
		}catch(err){
			print("load location " + err.lineNumber + "\n" + err);
		}
	});
}

function modTick(){
	if(isVisible){
		try{
			var string = "";
			if(Toggle.xyz) string += "XYZ: " + Entity.getX(getPlayerEnt()) + " / " + Entity.getY(getPlayerEnt()) + " / " + Entity.getZ(getPlayerEnt());
			if(Toggle.facing) {
				if(Math.abs(Entity.getYaw(getPlayerEnt()))<=45) string += "\nFacing: South (+Z)";
				if(Entity.getYaw(getPlayerEnt())>45 && Entity.getYaw(getPlayerEnt())<135) string += "\nFacing: West (-X)";
				if(Math.abs(Entity.getYaw(getPlayerEnt()))>=135) string += "\nFacing: North (-Z)";
				if(Entity.getYaw(getPlayerEnt())>-135 && Entity.getYaw(getPlayerEnt())<-45) string += "\nFacing: East (+X)";
			}
			if(Toggle.biome) string += "\nBiome: " + Level.getBiomeName(Entity.getX(getPlayerEnt()), Entity.getZ(getPlayerEnt()));
			ui(function(){
				try{
					loc.setText(string);
				} catch(err) {
					print("load info " + err.lineNumber + "\n" + err);
				}
			});
		}catch(err){
			print(err);
		}
	}
}
